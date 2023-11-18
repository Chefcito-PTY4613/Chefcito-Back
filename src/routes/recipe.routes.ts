import { Router } from "express";
import {
  createRecipe,
  delRecipe,
  getRecipe
} from "../controllers/recipe.controller";
import passport from "passport";
import { isAdmin } from "../middlewares/isUserType";

const recipeRouter = Router();

recipeRouter.get("/recipe/:id",[passport.authenticate("jwt", { session: false }), isAdmin], getRecipe);

recipeRouter.post("/recipe",[passport.authenticate("jwt", { session: false }), isAdmin], createRecipe);

recipeRouter.delete("/recipe/:id",[passport.authenticate("jwt", { session: false }), isAdmin], delRecipe);

export default recipeRouter;