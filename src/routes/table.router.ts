import { Router } from "express";
import { createTable,editTable,getTable } from "../controllers/table.controller";
import passport from "passport";
import { isAdmin } from "../middlewares/isUserType";

const TableRouter = Router()




TableRouter.get('/table',getTable)
TableRouter.post('/table', [passport.authenticate('jwt',{session:false}), isAdmin ], createTable)
TableRouter.put('/table', [passport.authenticate('jwt',{session:false}), isAdmin ], editTable)

export default TableRouter;
