import { Router } from "express";
import { signup,login } from "../controllers/user.controller";

const authRouter = Router()

authRouter.post('/signup',signup)
authRouter.post('/login',login)

export default authRouter;