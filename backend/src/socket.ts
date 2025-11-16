import { Server } from "socket.io";
import http from "http";

let io: Server | null = null;

export function initSocket(server: http.Server) {
    io = new Server(server, {
        cors: {
            origin: [process.env.VERCEL_LINK, "http://localhost:3000"],
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    console.log("Socket.IO initialized");
    return io;
}

export function getIO() {
    if (!io) {
        throw new Error("Socket.io not initialized! Call initSocket() first.");
    }
    return io;
}
