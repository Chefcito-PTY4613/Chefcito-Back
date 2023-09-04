import { Router } from "express";
import passport from "passport";
import { postUserType, putUserType, getUserType } from "../controllers/types/userTypes.controller";

import { isAdmin } from "../middlewares/isUserType";
import { getMovementType, postMovementType, putMovementType } from "../controllers/types/movement.controller";
import { getSaleStatus, postSaleStatus, putSaleStatus } from "../controllers/types/saleStatus.controller";
import { getFoodType, postFoodType, putFoodType } from "../controllers/types/foodType.controller";

const typesRouter = Router()

//Comidas
typesRouter.get('/foodtype',getFoodType)
typesRouter.post('/foodtype',[passport.authenticate('jwt',{session:false}),isAdmin],postFoodType)
typesRouter.put('/foodtype',[passport.authenticate('jwt',{session:false}),isAdmin],putFoodType)

//Movimientos
typesRouter.get('/movementtype' ,getMovementType)
typesRouter.post('/movementtype',[passport.authenticate('jwt',{session:false}),isAdmin],postMovementType)
typesRouter.put('/movementtype' ,[passport.authenticate('jwt',{session:false}),isAdmin],putMovementType)

//Ventas
typesRouter.get('/salestatus' ,getSaleStatus)
typesRouter.post('/salestatus',[passport.authenticate('jwt',{session:false}),isAdmin],postSaleStatus)
typesRouter.put('/salestatus' ,[passport.authenticate('jwt',{session:false}),isAdmin],putSaleStatus)

//Usuarios
typesRouter.get('/usertype' ,getUserType)
typesRouter.post('/usertype',[passport.authenticate('jwt',{session:false}),isAdmin],postUserType)
typesRouter.put('/usertype' ,[passport.authenticate('jwt',{session:false}),isAdmin],putUserType)


export default typesRouter;