import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { getSocketUrl } from '../../services/api';

const SOCKET_URL = getSocketUrl();

// Sub-component to format AI messages with Markdown code blocks & Copy support
const FormattedMessage = ({ text, isAI }) => {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleCopy = (code, idx) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (!isAI) {
    return <div className="whitespace-pre-wrap break-words">{text}</div>;
  }

  // Split code blocks (```...```) from standard text
  const parts = text.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-2 text-xs leading-relaxed overflow-x-auto">
      {parts.map((part, index) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          const match = part.match(/^```(\w+)?\n?([\s\S]*)```$/);
          const lang = match ? match[1] || 'code' : 'code';
          const codeContent = match ? match[2].trim() : part.slice(3, -3).trim();

          return (
            <div key={index} className="my-2 rounded-lg border border-white/10 bg-[#0c0c0e] overflow-hidden shadow-inner">
              <div className="flex justify-between items-center px-3 py-1.5 bg-white/5 border-b border-white/10 text-[10px] text-[#adc6ff]">
                <span className="font-mono uppercase font-bold tracking-wider">{lang}</span>
                <button
                  type="button"
                  onClick={() => handleCopy(codeContent, index)}
                  className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer px-1.5 py-0.5 rounded hover:bg-white/10"
                >
                  <span className="material-symbols-outlined text-[13px]">
                    {copiedIndex === index ? 'check' : 'content_copy'}
                  </span>
                  <span>{copiedIndex === index ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="p-3 text-[11px] font-mono text-[#e5e1e4] overflow-x-auto whitespace-pre leading-normal">
                {codeContent}
              </pre>
            </div>
          );
        }

        // Render standard paragraph text with line breaks
        const lines = part.split('\n');
        return (
          <div key={index} className="space-y-1">
            {lines.map((line, lIdx) => {
              if (!line.trim()) return null;
              return (
                <p key={lIdx} className="break-words">
                  {line}
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

const ChatPanel = ({ groupCode, username, currentCode = "", language = "javascript" }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [askAIMode, setAskAIMode] = useState(false);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(SOCKET_URL);

    socketRef.current.emit('join-room', groupCode);

    socketRef.current.on('chat-history', (history) => {
      setMessages(history);
    });

    socketRef.current.on('receive-message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socketRef.current.on('ai-typing', (data) => {
      if (data && data.roomCode === groupCode) {
        setIsAiTyping(!!data.isTyping);
      }
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [groupCode]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiTyping]);

  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (!inputMessage.trim()) return;

    const isAI = askAIMode || inputMessage.toLowerCase().includes('@ai') || inputMessage.toLowerCase().includes('@gemini');

    const messageData = {
      roomCode: groupCode,
      text: inputMessage,
      sender: username,
      askAI: isAI,
      currentCode,
      language,
      timestamp: new Date().toISOString(),
    };

    socketRef.current.emit('send-message', messageData);

    setInputMessage('');
    if (askAIMode) {
      setAskAIMode(false); // Reset AI mode toggle after sending
    }
  };

  const triggerQuickAIAction = (promptPrefix) => {
    const fullPrompt = `@ai ${promptPrefix}`;
    const messageData = {
      roomCode: groupCode,
      text: fullPrompt,
      sender: username,
      askAI: true,
      currentCode,
      language,
      timestamp: new Date().toISOString(),
    };

    socketRef.current.emit('send-message', messageData);
  };

  return (
    <div className="flex flex-col h-full bg-[#161619] rounded-xl border border-white/5 overflow-hidden">
      {/* Quick AI Assist Bar */}
      <div className="px-3 py-2 bg-[#0e0e10] border-b border-white/5 flex items-center justify-between gap-1 overflow-x-auto shrink-0">
        <span className="text-[10px] uppercase font-bold text-[#adc6ff]/70 tracking-wider shrink-0 flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px] text-[#3b82f6]">auto_awesome</span>
          Gemini AI:
        </span>
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => triggerQuickAIAction("Explain the current code in simple terms.")}
            className="px-2 py-1 bg-white/5 hover:bg-white/10 text-[10px] text-[#e5e1e4] rounded-md border border-white/10 cursor-pointer whitespace-nowrap transition-all active:scale-95"
          >
            💡 Explain Code
          </button>
          <button
            type="button"
            onClick={() => triggerQuickAIAction("Review the current code for bugs or errors.")}
            className="px-2 py-1 bg-white/5 hover:bg-white/10 text-[10px] text-[#e5e1e4] rounded-md border border-white/10 cursor-pointer whitespace-nowrap transition-all active:scale-95"
          >
            🐛 Find Bugs
          </button>
          <button
            type="button"
            onClick={() => triggerQuickAIAction("Refactor and optimize the current code.")}
            className="px-2 py-1 bg-white/5 hover:bg-white/10 text-[10px] text-[#e5e1e4] rounded-md border border-white/10 cursor-pointer whitespace-nowrap transition-all active:scale-95"
          >
            ⚡ Optimize
          </button>
        </div>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 flex flex-col min-h-[200px]">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
            <span className="material-symbols-outlined text-4xl text-[#3b82f6]/40 mb-2">forum</span>
            <p className="text-[#c2c6d6]/60 text-xs font-medium">Room Chat & Gemini AI</p>
            <p className="text-[#c2c6d6]/40 text-[11px] mt-1 max-w-[220px]">
              Chat with collaborators or type <span className="text-[#3b82f6] font-mono">@ai</span> / toggle AI mode to ask Gemini!
            </p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMe = msg.sender === username;
            const isAI = msg.isAI || msg.sender === "Gemini AI";

            return (
              <div
                key={msg._id || index}
                className={`flex flex-col max-w-[88%] ${
                  isAI
                    ? 'self-start items-start w-full max-w-[95%]'
                    : isMe
                    ? 'self-end items-end'
                    : 'self-start items-start'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-0.5 px-1">
                  {isAI ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-[#adc6ff] bg-[#3b82f6]/20 px-2 py-0.5 rounded-full border border-[#3b82f6]/30 shadow-[0_0_8px_rgba(59,130,246,0.2)]">
                      <span className="material-symbols-outlined text-[12px] text-[#3b82f6]">auto_awesome</span>
                      Gemini AI
                    </span>
                  ) : (
                    <span className="text-[10px] text-[#c2c6d6]/70 font-semibold">
                      {msg.sender}
                    </span>
                  )}
                </div>

                <div
                  className={`px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                    isAI
                      ? 'bg-[#121217] text-[#e5e1e4] border border-[#3b82f6]/30 rounded-tl-none shadow-[0_0_15px_rgba(59,130,246,0.1)] w-full'
                      : isMe
                      ? 'bg-[#3b82f6] text-white rounded-tr-none shadow-[0_0_10px_rgba(59,130,246,0.3)]'
                      : 'bg-white/5 text-[#e5e1e4] border border-white/5 rounded-tl-none'
                  }`}
                >
                  <FormattedMessage text={msg.text} isAI={isAI} />
                </div>

                <span className="text-[8px] text-[#c2c6d6]/40 mt-0.5 px-1">
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            );
          })
        )}

        {/* Real-Time AI Typing Indicator */}
        {isAiTyping && (
          <div className="self-start flex flex-col items-start max-w-[85%] animate-fade-in">
            <span className="flex items-center gap-1 text-[10px] font-bold text-[#adc6ff] mb-1">
              <span className="material-symbols-outlined text-[12px] text-[#3b82f6] animate-spin">sync</span>
              Gemini AI is thinking...
            </span>
            <div className="px-4 py-3 bg-[#121217] text-[#adc6ff] border border-[#3b82f6]/30 rounded-2xl rounded-tl-none flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#3b82f6] animate-ping" />
              <div className="w-2 h-2 rounded-full bg-[#3b82f6] animate-ping delay-150" />
              <div className="w-2 h-2 rounded-full bg-[#3b82f6] animate-ping delay-300" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Box */}
      <form
        onSubmit={handleSendMessage}
        className="p-2.5 border-t border-white/5 bg-[#0e0e10] flex flex-col gap-2"
      >
        <div className="flex gap-2 items-center">
          {/* Ask AI Toggle Pill */}
          <button
            type="button"
            onClick={() => setAskAIMode(!askAIMode)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer shrink-0 border ${
              askAIMode
                ? 'bg-[#3b82f6] text-white border-[#3b82f6] shadow-[0_0_10px_rgba(59,130,246,0.4)]'
                : 'bg-white/5 text-[#c2c6d6]/70 border-white/10 hover:text-white hover:bg-white/10'
            }`}
            title="Toggle Ask AI Mode"
          >
            <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
            <span>{askAIMode ? 'Ask AI' : 'Chat'}</span>
          </button>

          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={
              askAIMode
                ? "Ask Gemini AI anything about your code..."
                : "Type message or @ai to query Gemini..."
            }
            className={`flex-1 min-w-0 text-xs text-[#e5e1e4] placeholder-[#c2c6d6]/30 px-3 py-2 rounded-lg border outline-none transition-all ${
              askAIMode
                ? 'bg-[#3b82f6]/10 border-[#3b82f6]/50 focus:border-[#3b82f6]'
                : 'bg-white/5 border-white/10 focus:border-[#3b82f6]/50'
            }`}
          />

          <button
            type="submit"
            className="flex items-center justify-center p-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-lg active:scale-95 duration-100 cursor-pointer shrink-0 shadow-[0_0_10px_rgba(59,130,246,0.3)]"
          >
            <span className="material-symbols-outlined text-[16px]">send</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatPanel;
