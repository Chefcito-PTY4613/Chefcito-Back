import { Router } from "express";
import { createUserType, updateUserType, getUserType } from "../controllers/userTypes.controller";

const userTypeRouter = Router()

userTypeRouter.post('/usertype',createUserType)
userTypeRouter.put('/usertype' ,updateUserType)
userTypeRouter.get('/usertype' ,getUserType)

export default userTypeRouter;