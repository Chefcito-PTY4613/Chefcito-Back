import { Router } from "express";
import {
  paySale, paySaleForced,
} from "../controllers/sale.controller";
import passport from "passport";
import { isAdminOrWaiter } from "../middlewares/isUserType";

const saleRouter = Router();

saleRouter.put("/sale/pay/:id",[passport.authenticate("jwt", { session: false })], paySale);
saleRouter.put("/sale/pay/forced/:id",[passport.authenticate("jwt", { session: false }),isAdminOrWaiter], paySaleForced);

export default saleRouter;
