import { Request, Response } from "express";
import { ProcessType, IUpdateProcessType } from "../../models/types/process";



export const getProccess =  async(req: Request, res: Response) => {
  try {
    const processTypes = await ProcessType.find()
    res.json({processTypes})
  } catch (error) {
    res.status(400).json({msg:'Ha ocurrido un erro'})
  }

};

export const postProccess = async (req: Request, res: Response) => {
  const { name } = req.body;

  if (!name) return res.status(400).json({ msg: "Datos incompletos (name)" });

  // el tipo ya existe?
  const processType = await ProcessType.findOne({ name });
  if (processType) return res.status(400).json({ msg: "El tipo ya existe" });

  const newProcessType = new ProcessType({ name });
  await newProcessType.save();
  return res.status(201).json(newProcessType);
};

interface IProccessToUpdate{
  name?: string;
}

export const putProccess = async (req: Request, res: Response) => {
 
  const {id,name} = req.body as IUpdateProcessType;

  if(!id) return res.status(400).json({msg:'Se requiere id'})

  if(!name ) return res.status(400).json({msg:'Datos erroneos (desc,name)'})

  const toUpdate:IProccessToUpdate = {}
  
  if(name)toUpdate.name = name

  try {
      const updatedProcess  = await ProcessType.findByIdAndUpdate(id,{...toUpdate},{new: true})
      return res.status(200).json(updatedProcess)
  } catch (_) {
      return res.status(400).json({msg:'Registro repetido'})
  }

};
