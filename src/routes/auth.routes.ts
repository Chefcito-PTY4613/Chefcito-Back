import { Router } from "express";
import { signup, login, checkup, sendMailVerify } from "../controllers/user.controller";

const authRouter = Router();


authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.get('/verify/:id', sendMailVerify);
authRouter.get('/auth/checkup/:validate', checkup);

export default authRouter;
