import { Router } from "express";
import passport from "passport";
import { getFood, postFood, putFood } from "../controllers/food.controller";
import { isAdminOrStore } from "../middlewares/isUserType";

const foodRouter = Router()

foodRouter.get('/food',getFood)
foodRouter.post('/food', [passport.authenticate('jwt',{session:false}),isAdminOrStore],postFood )
foodRouter.put('/food', [passport.authenticate('jwt',{session:false}),isAdminOrStore], putFood)

export default foodRouter;
