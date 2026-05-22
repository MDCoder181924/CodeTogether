import { Server } from "socket.io";
import { YSocketIO } from "y-socket.io/dist/server";

export const setupEditorSocket = (server) => {

    const io = new Server(server, {
        cors: {
            origin: process.env.CLIENT_URL,
            credentials: true,
        },
    });

    const ysocketio = new YSocketIO(io);
    ysocketio.initialize();

    io.on("connection", (socket) => {

        console.log("Socket connected:", socket.id);

        socket.on("disconnect", () => {
            console.log("Socket disconnected:", socket.id);
        });
    });

    return io;
};
