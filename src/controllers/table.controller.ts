import { Request, Response } from "express";
import { Table, ITable } from "../models/table";
import { IUserAndType } from "../models/user";

export const getTable = async (req: Request, res: Response) => {
    const allTables = await Table.find()
    if(allTables) return res.status(200).json({tables:allTables})
    return res.status(400).json({msg:'ha ocurrido un error'})
}

export const createTable = async (req: Request, res: Response) => {
    const user = req.user as IUserAndType 
    if(!user.userType.name)return res.status(400).json({msg:'Usuario no autorizado'})
    const {num,size} = req.body;

    if(!num || !size) return res.status(400).json({msg:'Datos erroneos (num,size)'})

    const newTable  = new Table({num,size})

    try {
        await newTable.save()
        return res.status(200).json(newTable)
    } catch (_) {
        return res.status(400).json({msg:'Registro repetido'})
    }
}

interface ITableToUpdate{
    size?: number;
    active?: boolean;
}

export const editTable = async (req: Request, res: Response) => {
    const user = req.user as IUserAndType 

    if(!user.userType.name)return res.status(400).json({msg:'Usuario no autorizado'})
    const {id,size,active} = req.body;

    if(!id) return res.status(400).json({msg:'Se requiere id'})

    if(!active && !size ) return res.status(400).json({msg:'Datos erroneos (active,size)'})

    const toUpdate:ITableToUpdate = {}
    if(active !== undefined) toUpdate.active = active
    if(size )toUpdate.size = size

    try {
        const updatedTable  = await Table.findByIdAndUpdate(id,{...toUpdate},{new: true})
        return res.status(200).json(updatedTable)
    } catch (_) {
        return res.status(400).json({msg:'Registro repetido'})
    }
}
