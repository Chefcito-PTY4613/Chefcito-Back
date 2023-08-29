import { Router } from "express";
import { getCustomers } from "../controllers/user.controller";

const userRouter = Router()

userRouter.get('/user',getCustomers)


export default userRouter;