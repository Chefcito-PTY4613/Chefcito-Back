import { Router } from "express";
import { createTable,editTable,getTable } from "../controllers/table.controller";
import passport from "passport";


const TableRouter = Router()

TableRouter.get('/Table',getTable)
TableRouter.post('/Table', passport.authenticate('jwt',{session:false}),createTable)
TableRouter.put('/Table',editTable)


export default TableRouter;