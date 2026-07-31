import { Server } from "socket.io";
import { YSocketIO } from "y-socket.io/dist/server";
import Message from "../models/Chat/Message.js";
import Group from "../models/Group/Group.js";
import { askGemini } from "../services/geminiService.js";

/**
 * Helper: detect language from file extension
 */
const detectLanguage = (fileName) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    const langMap = {
        'js': 'javascript',
        'jsx': 'javascript',
        'ts': 'typescript',
        'tsx': 'typescript',
        'py': 'python',
        'java': 'java',
        'cpp': 'cpp',
        'c': 'c',
        'html': 'html',
        'css': 'css',
        'json': 'json',
        'md': 'markdown',
    };
    return langMap[ext] || 'javascript';
};

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
                const group = await Group.findOne({ groupCode: roomCode.trim().toUpperCase() });

                if (group) {
                    // Auto-migrate legacy groups with no files
                    if (group.files.length === 0) {
                        await group.save(); // triggers pre-save hook
                    }

                    // Send file list to the joining user
                    socket.emit("file-list", {
                        files: group.files,
                    });

                    // Legacy: also send code-history for backward compat
                    const firstFile = group.files[0];
                    socket.emit("code-history", {
                        code: firstFile ? firstFile.code : (group.currentCode || ""),
                        language: firstFile ? firstFile.language : (group.language || "javascript"),
                    });
                } else {
                    socket.emit("file-list", { files: [] });
                    socket.emit("code-history", { code: "", language: "javascript" });
                }

                // Fetch previous messages for this room
                const messages = await Message.find({ roomCode }).sort({ timestamp: 1 });
                socket.emit("chat-history", messages);
            } catch (err) {
                console.error("Error loading room history:", err);
            }
        });

        // ─── File Operations ─────────────────────────────

        /**
         * Create a new file in the group
         * data: { roomCode, fileName, code?, language? }
         */
        socket.on("create-file", async (data) => {
            try {
                const group = await Group.findOne({ groupCode: data.roomCode.trim().toUpperCase() });
                if (!group) return;

                // Check for duplicate
                const exists = group.files.some(
                    f => f.fileName.toLowerCase() === data.fileName.trim().toLowerCase()
                );
                if (exists) {
                    socket.emit("file-error", { message: "A file with that name already exists" });
                    return;
                }

                const detectedLang = data.language || detectLanguage(data.fileName.trim());

                group.files.push({
                    fileName: data.fileName.trim(),
                    code: data.code || "",
                    language: detectedLang,
                });
                await group.save();

                const addedFile = group.files[group.files.length - 1];

                // Broadcast to all users in the room
                io.to(data.roomCode).emit("file-created", {
                    file: addedFile,
                });
            } catch (err) {
                console.error("Error creating file:", err);
                socket.emit("file-error", { message: "Failed to create file" });
            }
        });

        /**
         * Rename a file
         * data: { roomCode, fileId, newFileName }
         */
        socket.on("rename-file", async (data) => {
            try {
                const group = await Group.findOne({ groupCode: data.roomCode.trim().toUpperCase() });
                if (!group) return;

                const file = group.files.id(data.fileId);
                if (!file) {
                    socket.emit("file-error", { message: "File not found" });
                    return;
                }

                // Check for duplicate name
                const duplicateExists = group.files.some(
                    f => f._id.toString() !== data.fileId && f.fileName.toLowerCase() === data.newFileName.trim().toLowerCase()
                );
                if (duplicateExists) {
                    socket.emit("file-error", { message: "A file with that name already exists" });
                    return;
                }

                const oldFileName = file.fileName;
                file.fileName = data.newFileName.trim();
                file.language = detectLanguage(data.newFileName.trim());
                await group.save();

                // Broadcast to all users in the room
                io.to(data.roomCode).emit("file-renamed", {
                    fileId: data.fileId,
                    oldFileName,
                    newFileName: file.fileName,
                    language: file.language,
                });
            } catch (err) {
                console.error("Error renaming file:", err);
                socket.emit("file-error", { message: "Failed to rename file" });
            }
        });

        /**
         * Delete a file
         * data: { roomCode, fileId }
         */
        socket.on("delete-file", async (data) => {
            try {
                const group = await Group.findOne({ groupCode: data.roomCode.trim().toUpperCase() });
                if (!group) return;

                if (group.files.length <= 1) {
                    socket.emit("file-error", { message: "Cannot delete the last file" });
                    return;
                }

                const file = group.files.id(data.fileId);
                if (!file) {
                    socket.emit("file-error", { message: "File not found" });
                    return;
                }

                const deletedFileName = file.fileName;
                const deletedFileId = file._id.toString();
                group.files.pull(data.fileId);
                await group.save();

                // Broadcast to all users in the room
                io.to(data.roomCode).emit("file-deleted", {
                    fileId: deletedFileId,
                    fileName: deletedFileName,
                    remainingFiles: group.files,
                });
            } catch (err) {
                console.error("Error deleting file:", err);
                socket.emit("file-error", { message: "Failed to delete file" });
            }
        });

        // ─── Chat & Code Operations ─────────────────────

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

        /**
         * Save code for a specific file
         * data: { roomCode, code, language, fileName? }
         */
        socket.on("save-code", async (data) => {
            try {
                const group = await Group.findOne({ groupCode: data.roomCode.trim().toUpperCase() });
                if (!group) return;

                if (data.fileName) {
                    // Multi-file mode: save to specific file
                    const file = group.files.find(
                        f => f.fileName === data.fileName
                    );
                    if (file) {
                        file.code = data.code;
                        if (data.language) file.language = data.language;
                        await group.save();
                    }
                } else {
                    // Legacy single-file mode
                    await Group.findOneAndUpdate(
                        { groupCode: data.roomCode.trim().toUpperCase() },
                        { currentCode: data.code, language: data.language }
                    );
                }
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
