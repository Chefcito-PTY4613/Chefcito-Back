import { Server } from "socket.io"; 

export default (io:Server) => {
  io.on("connection", (socket) => {
    socket.on("chat:userMsg", () => {
    });
  });
};