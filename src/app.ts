import express from "express";
import morgan from "morgan";
import cors from "cors";

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

//init
const app = express();

//settings
app.set("port", process.env.PORT || 4000);

//middlewares
app.use(morgan("dev"));
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(passport.initialize());
passport.use(passMiddleware);

//routes
app.use(authRouter);
app.use(ingredientRouter)
app.use(userRouter);
app.use(tableRouter);
app.use(reservationRouter);
app.use(foodRouter);
app.use(orderRouter);
app.use('/type',typeRouter);

//Docs

export default app;
