import { Server } from "socket.io"; 
import { IOrder } from "../models/order";

export default (io:Server) => {
  io.on("connection", (socket) => {
    socket.on('order:newOrder', (data:IOrder, callback) => {   
      callback(data.id)   
      socket.broadcast.emit('order:sendOrder',data)
    });
  });
};
