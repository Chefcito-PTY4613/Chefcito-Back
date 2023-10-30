import chat from "./chatSubscription";
import movement from "./movementSubscription";
import order from "./orderSubscription";

import { Server } from "socket.io"; 

const geneal = (io:Server) => {
  io.on("connection", (socket) => {
    console.log("🚀 ~ Connect:",socket.id)
    socket.on("disconnect", () => {  
      console.log("💀 ~ Disconnect:",socket.id)    
    });
  });
};

export const subscriptions = {
  geneal,
  chat,
  movement,
  order,
};
