import axios from 'axios';

/**
 * Generates AI response from Google Gemini API.
 * @param {Object} params
 * @param {string} params.prompt - The user query or prompt.
 * @param {Array} [params.chatHistory] - Recent messages in the room for context.
 * @param {string} [params.currentCode] - The active code in the collaborative editor.
 * @param {string} [params.language] - Programming language of the active code.
 * @returns {Promise<string>} AI response text.
 */
export const askGemini = async ({ prompt, chatHistory = [], currentCode = '', language = '' }) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured in environment variables.");
  }

  // Model hierarchy: prioritized working models first
  const models = [
    'gemini-3.6-flash',
    'gemini-3.5-flash',
    'gemini-2.0-flash',
    'gemini-flash-latest'
  ];

  // Clean prompt command prefixes if any (e.g. "@ai ", "@gemini ")
  const cleanPrompt = prompt.replace(/^@(ai|gemini)\s*/i, '').trim();

  // Prepare System and Context Prompt
  let systemPrompt = `You are Gemini AI, an expert software developer and real-time pair programming assistant inside CodeTogether.
You are helping group members who are collaborating in a shared code workspace.
Be concise, helpful, accurate, and friendly.
When providing code, use GitHub Flavored Markdown code blocks with appropriate language tags so it formats nicely.`;

  if (currentCode && currentCode.trim()) {
    systemPrompt += `\n\n[Active Code File Context (${language || 'javascript'})]:\n\`\`\`${language || ''}\n${currentCode.slice(0, 4000)}\n\`\`\``;
  }

  // Include recent chat context (up to 8 recent messages)
  let conversationContext = '';
  if (Array.isArray(chatHistory) && chatHistory.length > 0) {
    const recent = chatHistory.slice(-8);
    conversationContext = recent.map(msg => `${msg.sender}: ${msg.text}`).join('\n');
  }

  let finalPrompt = `${systemPrompt}`;
  if (conversationContext) {
    finalPrompt += `\n\n[Recent Room Conversation]:\n${conversationContext}`;
  }
  finalPrompt += `\n\n[User Prompt]: ${cleanPrompt}`;

  const payload = {
    contents: [
      {
        parts: [
          { text: finalPrompt }
        ]
      }
    ]
  };

  let lastError = null;

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const response = await axios.post(url, payload, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 25000
      });

      if (response.data && response.data.candidates && response.data.candidates[0]?.content?.parts[0]?.text) {
        return response.data.candidates[0].content.parts[0].text;
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error?.message || err.message;
      console.warn(`Gemini model [${model}] attempt error:`, errorMsg);
      lastError = errorMsg;
    }
  }

  throw new Error(lastError || "Failed to generate response from Gemini API.");
};
