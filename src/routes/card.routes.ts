import { Router } from "express";
import { createCard, deleteCard,getCard } from "../controllers/card.controller";
import passport from "passport";

const cardRouter = Router();


cardRouter.get("/card", [passport.authenticate('jwt',{session:false})], getCard);
cardRouter.post("/card", [passport.authenticate('jwt',{session:false})], createCard);
cardRouter.delete("/card/:id", [passport.authenticate('jwt',{session:false})], deleteCard);


export default cardRouter;
