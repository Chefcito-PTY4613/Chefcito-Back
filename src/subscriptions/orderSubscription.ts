import { Server } from "socket.io"; 
import { IOrder } from "../models/order";

/**
 * Al crear una nueva orden tengo que emitir una señal a la administración
 * Cuando se actualiza una orden tengo que enviar la información al dueño y administración
 * 
*/

export default (io:Server) => {
  io.on("connection", (socket) => {
    socket.on('order:newOrder', (data:IOrder, callback) => {   
      callback()   
      socket.broadcast.emit('order:sendOrder',data)
    });
    socket.on('order:updateOrder', (data:IOrder, callback) => {   
      callback()   
      socket.broadcast.emit('order:sendOrder',data)
    });
  });
};
