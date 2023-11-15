import { Router } from "express";
import passport from "passport";
import { getIngredient, getIngredientRecipe, getIngredientStock, postIngredient, putIngredient } from "../controllers/ingredient.controller";
import { isAdminOrStore } from "../middlewares/isUserType";

const ingredientRouter = Router()

ingredientRouter.get('/ingredient',passport.authenticate('jwt',{session:false}),getIngredient)

ingredientRouter.get('/ingredient/stock/:id',getIngredientStock)

ingredientRouter.get('/ingredient/recipe', [passport.authenticate('jwt',{session:false})],getIngredientRecipe )

ingredientRouter.post('/ingredient', [passport.authenticate('jwt',{session:false}),isAdminOrStore],postIngredient )

ingredientRouter.put('/ingredient', [passport.authenticate('jwt',{session:false}),isAdminOrStore], putIngredient)

export default ingredientRouter;
