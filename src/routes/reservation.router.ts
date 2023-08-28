import { Router } from "express";
import { createReservation,cancelReservation,finishReservation, getReservation } from "../controllers/reservation.controller";
import passport from "passport";


const reservationRouter = Router()

reservationRouter.get('/reservation',getReservation)
reservationRouter.post('/reservation', passport.authenticate('jwt',{session:false}),createReservation)
reservationRouter.put('/reservation',finishReservation)
reservationRouter.delete('/reservation',cancelReservation)


export default reservationRouter;