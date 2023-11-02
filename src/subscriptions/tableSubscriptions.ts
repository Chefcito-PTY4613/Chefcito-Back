import { Server } from "socket.io";
import { ITable } from "../models/table";

/**
 * Mesa update
*/

export default (io:Server) => {
  io.on("connection", (socket) => {
    socket.on('table:save', (data:ITable, callback) => {   
      callback()   
      socket.broadcast.emit('table:save',data)
    });
  });
};
