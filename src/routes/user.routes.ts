import { Router } from "express";
import { getCustomers, postWorker } from "../controllers/user.controller";
import passport from "passport";
import { isAdmin } from "../middlewares/isUserType";

const userRouter = Router()
/**
* @swagger
*
* /user: 
*   get:
*     sumary: get users customers.
* 
* 
* /worker:
*   post:
*     summary: create worker.
*
*
*/
userRouter.get('/user',getCustomers)
userRouter.post('/worker',[passport.authenticate('jwt',{session:false}),isAdmin],postWorker)

export default userRouter;