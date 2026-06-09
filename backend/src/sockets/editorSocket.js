import { Server } from "socket.io";
import { YSocketIO } from "y-socket.io/dist/server";
import Message from "../models/Chat/Message.js";
import Group from "../models/Group/Group.js";

export const setupEditorSocket = (server) => {

    const rawClientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const clientOrigin = rawClientUrl.replace(/\/$/, '');

    const io = new Server(server, {
        cors: {
            origin: clientOrigin,
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
                const newMessage = await Message.create({
                    roomCode: data.roomCode,
                    sender: data.sender,
                    text: data.text,
                    timestamp: data.timestamp || new Date().toISOString()
                });

                io.to(data.roomCode).emit("receive-message", {
                    text: newMessage.text,
                    sender: newMessage.sender,
                    timestamp: newMessage.timestamp
                });
            } catch (err) {
                console.error("Error saving message:", err);
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
