import { Router } from "express";
import { signup, login, checkup, sendMailVerify, passChange } from "../controllers/auth.controller";

const authRouter = Router();


authRouter.post("/signup", signup);
authRouter.post("/login", login);

authRouter.get('/verify/:id', sendMailVerify);
authRouter.get('/auth/checkup/:validate', checkup);

authRouter.put("/pass/change/:id", passChange);


export default authRouter;
