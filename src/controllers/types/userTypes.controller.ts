import { Request, Response } from "express";
import { IUpdateUserType, UserType } from "../../models/types/userType";


export const getUserType =  async(req: Request, res: Response) => {
  try {
    const data = await UserType.find()
    res.json(data)
  } catch (error) {
    res.status(400).json({msg:'Ha ocurrido un erro'})
  }

};

export const postUserType = async (req: Request, res: Response) => {
  const { name, desc } = req.body;

  if (!name || !desc) return res.status(400).json({ msg: "Datos incompletos (name, desc)" });

  // el tipo ya existe?
  const userType = await UserType.findOne({ name });
  if (userType) return res.status(400).json({ msg: "El tipo ya existe" });

  const data = new UserType({ name, desc });
  await data.save();
  return res.status(201).json(data);
};

interface IUserTypeToUpdate{
  name?: string;
  desc?: string;
}

export const putUserType = async (req: Request, res: Response) => {
 
  const {id,name,desc} = req.body as IUpdateUserType;

  if(!id) return res.status(400).json({msg:'Se requiere id'})

  if(!desc && !name ) return res.status(400).json({msg:'Datos erroneos (desc,name)'})

  const toUpdate:IUserTypeToUpdate = {}
  
  if(desc !== undefined) toUpdate.desc = desc
  if(name)toUpdate.name = name

  try {
      const data  = await UserType.findByIdAndUpdate(id,{...toUpdate},{new: true})
      return res.status(200).json(data)
  } catch (_) {
      return res.status(400).json({msg:'Registro repetido'})
  }

};
