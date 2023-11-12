import { Router } from "express";
import {
  getRecipe
} from "../controllers/recipe.controller";
import passport from "passport";
import { isAdmin } from "../middlewares/isUserType";

const recipeRouter = Router();

recipeRouter.get("/recipe/:id",[passport.authenticate("jwt", { session: false }), isAdmin], getRecipe);

export default recipeRouter;