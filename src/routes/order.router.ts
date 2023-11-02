import { Router } from "express";
import {
  getOrder,
  getOrderManagement,
  createOrder,
  getOrderBySale
} from "../controllers/order.controller";
import passport from "passport";
import { isAdmin } from "../middlewares/isUserType";

const orderRouter = Router();

orderRouter.get("/order/management",[passport.authenticate("jwt", { session: false }), isAdmin], getOrderManagement);

orderRouter.get("/order",passport.authenticate("jwt", { session: false }), getOrder);

orderRouter.get("/orderBySale", getOrderBySale);

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
