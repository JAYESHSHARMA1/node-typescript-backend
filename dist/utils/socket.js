"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
let io;
exports.default = {
    init: (httpServer) => {
        io = new socket_io_1.Server(httpServer);
        return io;
    },
    getIO: () => {
        if (!io) {
            throw Error("Socket.io not initialized!");
        }
        return io;
    },
};
