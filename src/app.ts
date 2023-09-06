import express from "express";
import morgan from "morgan";
import cors from "cors";

import swaggerUI from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

import passport from "passport";
import passMiddleware from "./middlewares/passport";

import authRouter from "./routes/auth.routes";
import typeRouter from "./routes/types.routes";
import reservationRouter from "./routes/reservation.router";
import tableRouter from "./routes/table.router";
import userRouter from "./routes/user.routes";

const swaggerOptions: swaggerJSDoc.Options = {
    definition: {
    info: {
      version: "0.1",
      title: "Chefcito API",
      description:
        'Proyecto Back-end de la plataforma de "restorant management" con el Stack Node, Express, Mongoose, JWTy TS',
    },
  },
  apis: [
    "./src/routes/auth.routes.ts",
    "./src/routes/reservation.router.ts",
    "./src/routes/table.router.ts",
    "./src/routes/types.routes.ts",
    "./src/routes/user.routes.ts",
  ],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

//init
const app = express();

//settings
app.set("port", process.env.PORT || 3000);

//middlewares
app.use(morgan("dev"));
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(passport.initialize());
passport.use(passMiddleware);

//routes
app.use(authRouter);
app.use(typeRouter);
app.use(reservationRouter);
app.use(userRouter);
app.use(tableRouter);

//Docs
app.use("/", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

export default app;
