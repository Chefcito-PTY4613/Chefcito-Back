import { Server } from "socket.io"; 
import { IReservation } from "../models/reservation";

/**
 * Al crear una nueva reservacion se notifica a la administración
 * Cuando se actualiza una reservacion tengo que enviar la información al dueño y administración
 * 
*/

export default (io:Server) => {
  io.on("connection", (socket) => {
    socket.on('reservation:newReservation', (data:IReservation, callback) => {   
      callback()   
      socket.broadcast.emit('reservation:sendReservation',data)
    });
    socket.on('reservation:updateReservation', (data:IReservation, callback) => {   
      callback()   
      socket.broadcast.emit('reservation:sendReservation',data)
    });
  });
};
