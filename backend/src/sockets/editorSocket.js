import { Server } from "socket.io";
import { YSocketIO } from "y-socket.io/dist/server";
import Message from "../models/Chat/Message.js";
import Group from "../models/Group/Group.js";
import { askGemini } from "../services/geminiService.js";

export const setupEditorSocket = (server) => {

    const allowedOrigins = [
        'http://localhost:5173',
        'http://localhost:3000',
        'http://localhost:4173',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:4173',
    ];

    if (process.env.CLIENT_URL) {
        const cleanClientUrl = process.env.CLIENT_URL.replace(/\/$/, '');
        if (!allowedOrigins.includes(cleanClientUrl)) {
            allowedOrigins.push(cleanClientUrl);
        }
    }

    const io = new Server(server, {
        cors: {
            origin: (origin, callback) => {
                if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
                    return callback(null, true);
                }
                return callback(null, true);
            },
            credentials: true,
        },
    });

    const ysocketio = new YSocketIO(io);
    ysocketio.initialize();

    io.on("connection", (socket) => {

        console.log("Socket connected:", socket.id);

        socket.on("join-room", async (roomCode) => {
            socket.join(roomCode);
            console.log(`User ${socket.id} joined room: ${roomCode}`);

            try {
                // Fetch group code snapshot and language from MongoDB
                const group = await Group.findOne({ groupCode: roomCode.trim().toUpperCase() });
                socket.emit("code-history", {
                    code: group ? group.currentCode : "",
                    language: group ? group.language : "javascript"
                });

                // Fetch previous messages for this room
                const messages = await Message.find({ roomCode }).sort({ timestamp: 1 });
                socket.emit("chat-history", messages);
            } catch (err) {
                console.error("Error loading room history:", err);
            }
        });

        socket.on("send-message", async (data) => {
            try {
                // 1. Save user message to database
                const newMessage = await Message.create({
                    roomCode: data.roomCode,
                    sender: data.sender,
                    text: data.text,
                    isAI: !!data.isAI,
                    timestamp: data.timestamp || new Date().toISOString()
                });

                // 2. Broadcast message to all users in the room
                io.to(data.roomCode).emit("receive-message", {
                    _id: newMessage._id,
                    roomCode: newMessage.roomCode,
                    text: newMessage.text,
                    sender: newMessage.sender,
                    isAI: newMessage.isAI,
                    timestamp: newMessage.timestamp
                });

                // 3. Check if this message should trigger Gemini AI
                const textLower = (data.text || '').toLowerCase();
                const isExplicitAI = data.askAI === true || data.targetAI === true;
                const containsAITrigger = textLower.includes('@ai') || textLower.includes('@gemini') || textLower.startsWith('/ai');

                if (isExplicitAI || containsAITrigger) {
                    // Notify room that AI is thinking
                    io.to(data.roomCode).emit("ai-typing", {
                        roomCode: data.roomCode,
                        isTyping: true,
                        sender: "Gemini AI"
                    });

                    // Fetch context: active code, language, and recent chat history
                    const group = await Group.findOne({ groupCode: data.roomCode.trim().toUpperCase() });
                    const recentMessages = await Message.find({ roomCode: data.roomCode }).sort({ timestamp: 1 }).limit(20);

                    const currentCode = data.currentCode || (group ? group.currentCode : "");
                    const language = data.language || (group ? group.language : "javascript");

                    let aiResponseText = "";
                    try {
                        aiResponseText = await askGemini({
                            prompt: data.text,
                            chatHistory: recentMessages,
                            currentCode,
                            language
                        });
                    } catch (geminiError) {
                        console.error("Gemini AI error:", geminiError.message);
                        aiResponseText = `⚠️ **Gemini AI Error:** ${geminiError.message || "Unable to reach AI service. Please verify your GEMINI_API_KEY."}`;
                    }

                    // Save AI response to database
                    const aiMessage = await Message.create({
                        roomCode: data.roomCode,
                        sender: "Gemini AI",
                        text: aiResponseText,
                        isAI: true,
                        timestamp: new Date().toISOString()
                    });

                    // Stop typing animation and broadcast AI message to room
                    io.to(data.roomCode).emit("ai-typing", {
                        roomCode: data.roomCode,
                        isTyping: false,
                        sender: "Gemini AI"
                    });

                    io.to(data.roomCode).emit("receive-message", {
                        _id: aiMessage._id,
                        roomCode: aiMessage.roomCode,
                        text: aiMessage.text,
                        sender: aiMessage.sender,
                        isAI: true,
                        timestamp: aiMessage.timestamp
                    });
                }
            } catch (err) {
                console.error("Error saving/processing message:", err);
            }
        });

        socket.on("save-code", async (data) => {
            try {
                await Group.findOneAndUpdate(
                    { groupCode: data.roomCode.trim().toUpperCase() },
                    { currentCode: data.code, language: data.language }
                );
            } catch (err) {
                console.error("Error auto-saving code:", err);
            }
        });

        socket.on("disconnect", () => {
            console.log("Socket disconnected:", socket.id);
        });
    });

    return io;
};
