import { Router } from "express";
import passport from "passport";
import { getIngredient, getIngredientStock, postIngredient, putIngredient } from "../controllers/ingredient.controller";
import { isAdminOrStore } from "../middlewares/isUserType";

const ingredientRouter = Router()

ingredientRouter.get('/ingredient',passport.authenticate('jwt',{session:false}),getIngredient)

ingredientRouter.get('/ingredient/stock/:id',getIngredientStock)

ingredientRouter.post('/ingredient', [passport.authenticate('jwt',{session:false}),isAdminOrStore],postIngredient )
ingredientRouter.put('/ingredient', [passport.authenticate('jwt',{session:false}),isAdminOrStore], putIngredient)

export default ingredientRouter;
