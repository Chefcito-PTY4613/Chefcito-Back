import { Router } from "express";
import {
  getOrder,
  getOrderManagement,
  createOrder
} from "../controllers/order.controller";
import passport from "passport";
import { isAdmin } from "../middlewares/isUserType";

const orderRouter = Router();

orderRouter.get("/order/management",[passport.authenticate("jwt", { session: false }), isAdmin], getOrderManagement);

orderRouter.get("/order", getOrder);

orderRouter.post(
  "/order",
  [passport.authenticate("jwt", { session: false })],
  createOrder
);

orderRouter.put(
  "/order",
  [passport.authenticate("jwt", { session: false })]
  
);

orderRouter.delete(
  "/order",
  [passport.authenticate("jwt", { session: false })]
);

export default orderRouter;
