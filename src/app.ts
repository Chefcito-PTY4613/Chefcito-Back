import express from "express";
import morgan from "morgan";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import expressListEndpoints, { Endpoint } from "express-list-endpoints";

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
app.use("/type", typeRouter);

const allRoutes = expressListEndpoints(app);

app.get("/", (req, res) => {
  function compareByName(a: Endpoint, b: Endpoint) {
    return a.path.localeCompare(b.path);
  }
  const lines = allRoutes.sort(compareByName).map(
    (route) => `
  Paths: </br>
  <a href="https://chefcito-back-production.up.railway.app${
    route.path
  }" target="_blank"> https://chefcito-back-production.up.railway.app${
      route.path
    }</a> 
  </br>
  <a href="http://localhost:4000${
    route.path
  }" target="_blank"> http://localhost:4000${route.path}</a> 
  <br/>
  <br/>
  Methods:</br> ${route.methods.join(", ")}
  <br/>
  <br/>
  Middlewares:</br> 
  ${route.middlewares}
  </br> 
  `
  );
  res.send(`
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');
    *{
      font-family: Roboto
    }

  </style> ${lines.join("<hr/>")}`);
});
export {app,io}
