import { Router } from "express";
import {
  createReservation,
  cancelReservation,
  finishReservation,
  getReservation,
  getReservationManagement,
} from "../controllers/reservation.controller";
import passport from "passport";
import { isAdmin } from "../middlewares/isUserType";

const reservationRouter = Router();

reservationRouter.post("/reservation/management",[passport.authenticate("jwt", { session: false }), isAdmin], getReservationManagement);

reservationRouter.get("/reservation",[passport.authenticate("jwt", { session: false })], getReservation);

reservationRouter.post(
  "/reservation",
  [passport.authenticate("jwt", { session: false })],
  createReservation
);

reservationRouter.put(
  "/reservation",
  [passport.authenticate("jwt", { session: false })],
  finishReservation
);

reservationRouter.delete(
  "/reservation",
  [passport.authenticate("jwt", { session: false })],
  cancelReservation
);

export default reservationRouter;
