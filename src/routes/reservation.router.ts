import { Router } from "express";
import {
  createReservation,
  cancelReservation,
  finishReservation,
  getReservation,
  getReservationManagement
} from "../controllers/reservation.controller";
import passport from "passport";

const reservationRouter = Router();

reservationRouter.get("/reservation/management", 
  getReservationManagement);

reservationRouter.get("/reservation",
  getReservation);

reservationRouter.post(
  "/reservation",
  passport.authenticate("jwt", { session: false }),
  createReservation
);

reservationRouter.put(
  "/reservation",
  passport.authenticate("jwt", { session: false }),
  finishReservation
);

reservationRouter.delete(
  "/reservation",
  passport.authenticate("jwt", { session: false }),
  cancelReservation
);

export default reservationRouter;
