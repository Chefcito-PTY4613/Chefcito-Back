import express from "express";
import morgan from "morgan";
import cors from "cors";
import http from "http";
import path from 'path';
import { Server } from "socket.io";


import passport from "passport";
import passMiddleware from "./middlewares/passport";

import authRouter from "./routes/auth.routes";
import typeRouter from "./routes/types.routes";
import reservationRouter from "./routes/reservation.router";
import tableRouter from "./routes/table.router";
import userRouter from "./routes/user.routes";
import ingredientRouter from "./routes/ingredient.router";
import foodRouter from "./routes/food.router";
import orderRouter from "./routes/order.router";
import saleRouter from "./routes/sale.router";
import recipeRouter from "./routes/recipe.routes";
import cardRouter from "./routes/card.routes";
import mainRouter from "./routes/main";

//socket
import { subscriptions } from "./subscriptions/subscriptions";

//init
const app = express();

// Create an HTTP server and pass the Express app to it
const server = http.createServer(app);

// Set the server to listen on the specified port
const port = process.env.PORT || 4000;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

//middlewares
app.use(morgan("dev"));
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(passport.initialize());
passport.use(passMiddleware);

const io = new Server(server, {
  cors:{
      origin: "*",
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      credentials: true
    }
});

//subscriptions sockets
subscriptions.geneal(io);
subscriptions.chat(io);
subscriptions.movement(io);
subscriptions.order(io);
subscriptions.reservation(io);

//routes
app.use(authRouter);
app.use(ingredientRouter);
app.use(userRouter);
app.use(tableRouter);
app.use(reservationRouter);
app.use(foodRouter);
app.use(orderRouter);
app.use(saleRouter);
app.use(recipeRouter);
app.use(cardRouter);

app.use('/type', typeRouter);
app.use('/docs', express.static(path.join(__dirname, 'MongoDocs')));

app.use(mainRouter)

export {app,io}
