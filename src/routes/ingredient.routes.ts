import { Router } from "express";
import passport from "passport";
import { getIngredient, postIngredient, putIngredient } from "../controllers/ingredient.controller";
import { isAdminOrStore } from "../middlewares/isUserType";

const TableRouter = Router()

/**
* @swagger
* 
* /ingredient: 
*   get:
*     sumary: get ingredients
* 
* 
* /ingredient:
*   post:
*     summary: Create customer.
*
*
* /ingredient:
*   put:
*     summary: ingredient update.
*
*
*/

TableRouter.get('/ingredient',passport.authenticate('jwt',{session:false}),getIngredient)
TableRouter.post('/ingredient', [passport.authenticate('jwt',{session:false}),isAdminOrStore],postIngredient )
TableRouter.put('/ingredient', [passport.authenticate('jwt',{session:false}),isAdminOrStore], putIngredient)

export default TableRouter;
