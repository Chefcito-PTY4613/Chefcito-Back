import { Router } from "express";
import passport from "passport";
import { postUserType, putUserType, getUserType } from "../controllers/types/userTypes.controller";

import { isAdmin } from "../middlewares/isUserType";
import { getMovementType, postMovementType, putMovementType } from "../controllers/types/movement.controller";
import { getSaleStatus, postSaleStatus, putSaleStatus } from "../controllers/types/saleStatus.controller";
import { getFoodType, postFoodType, putFoodType } from "../controllers/types/foodType.controller";
import { getProccess, postProccess, putProccess } from "../controllers/types/process.controller";
import { getMeasurement, postMeasurement, putMeasurement } from "../controllers/types/unitOfMeasurement.controller";

const typesRouter = Router()

/**
* @swagger
*
* /type/food: 
*   get:
*     sumary: get food types.
* 
* 
* /type/movement:
*   get:
*     summary: get movement types.
*
*
* /type/sale:
*   get:
*     summary: get sales status.
*
*
* /type/measurement:
*   get:
*     summary: get measurement types (unidades de media).
*
*
* /type/user:
*   get:
*     summary: get user types.
*
*
* /type/proccess:
*   get:
*     summary: get process types (cocina).
*
*
*/


//Comidas
typesRouter.get('/food',getFoodType)
typesRouter.post('/food',[passport.authenticate('jwt',{session:false}),isAdmin],postFoodType)
typesRouter.put('/food',[passport.authenticate('jwt',{session:false}),isAdmin],putFoodType)

//Movimientos
typesRouter.get('/movement' ,getMovementType)
typesRouter.post('/movement',[passport.authenticate('jwt',{session:false}),isAdmin],postMovementType)
typesRouter.put('/movement' ,[passport.authenticate('jwt',{session:false}),isAdmin],putMovementType)

//Ventas
typesRouter.get('/sale' ,getSaleStatus)
typesRouter.post('/sale',[passport.authenticate('jwt',{session:false}),isAdmin],postSaleStatus)
typesRouter.put('/sale' ,[passport.authenticate('jwt',{session:false}),isAdmin],putSaleStatus)

//Unidades de medida
typesRouter.get('/measurement' ,getMeasurement)
typesRouter.post('/measurement',[passport.authenticate('jwt',{session:false}),isAdmin],postMeasurement)
typesRouter.put('/measurement' ,[passport.authenticate('jwt',{session:false}),isAdmin],putMeasurement)

//Usuarios
typesRouter.get('/user' ,getUserType)
typesRouter.post('/user',[passport.authenticate('jwt',{session:false}),isAdmin],postUserType)
typesRouter.put('/user' ,[passport.authenticate('jwt',{session:false}),isAdmin],putUserType)

//Procesos de cocina
typesRouter.get('/proccess' ,getProccess)
typesRouter.post('/proccess',[passport.authenticate('jwt',{session:false}),isAdmin],postProccess)
typesRouter.put('/proccess' ,[passport.authenticate('jwt',{session:false}),isAdmin],putProccess)


export default typesRouter;