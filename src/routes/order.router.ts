import { Router } from "express";
import {
  getOrder,
  getOrderManagement,
  createOrder,
  getOrderBySale,
  getOrderById,
} from "../controllers/order.controller";
import passport from "passport";
import { isAdmin } from "../middlewares/isUserType";

const orderRouter = Router();

orderRouter.get(
  "/order/management",
  [passport.authenticate("jwt", { session: false }), isAdmin],
  getOrderManagement
);

orderRouter.get(
  "/order/:id",
  [passport.authenticate("jwt", { session: false })],
  getOrderById
);

orderRouter.get(
  "/order",
  passport.authenticate("jwt", { session: false }),
  getOrder
);

orderRouter.get("/order/sale/:id",
passport.authenticate("jwt", { session: false }), 
getOrderBySale);

orderRouter.post(
  "/order",
  [passport.authenticate("jwt", { session: false })],
  createOrder
);

orderRouter.put("/order", [passport.authenticate("jwt", { session: false })]);

orderRouter.delete("/order", [
  passport.authenticate("jwt", { session: false }),
]);

export default orderRouter;
