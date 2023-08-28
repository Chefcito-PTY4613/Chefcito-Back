import express  from "express";
import morgan from "morgan";
import cors from "cors";

import passport from "passport";
import passMiddleware from "./middlewares/passport";

import authRouter from './routes/auth.routes'
import userTypeRouter from "./routes/userTypes.routes";
import reservationRouter from "./routes/reservation.router";

//init
const app = express()

//settings
app.set('port', process.env.PORT || 3000)

//middlewares
app.use(morgan('dev'))
app.use(cors())
app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use(passport.initialize())
passport.use(passMiddleware)

//routes
app.get('/',(req,res)=>{
    res.send(`La API estan en https://localhost:${app.get('port')}/`)
})
app.use(authRouter);
app.use(userTypeRouter);
app.use(reservationRouter);



export default app;