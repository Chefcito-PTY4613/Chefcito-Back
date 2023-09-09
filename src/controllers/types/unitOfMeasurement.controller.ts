import { Request, Response } from "express";
import { optionalToUpdate } from "../../libs/fn.ratapan";
import { UnitOfMeasurement, IUpdateUnitOfMeasurement, IUnitOfMeasurement } from "../../models/types/unitOfMeasurement";


export const getMeasurement =  async(req: Request, res: Response) => {
  try {
    const data = await UnitOfMeasurement.find()
    res.json(data)
  } catch (error) {
    res.status(400).json({msg:'Ha ocurrido un erro'})
  }
}

export const postMeasurement =  async(req: Request, res: Response) => {
  const { name } = req.body as IUnitOfMeasurement;

  if (!name)
    return res
      .status(400)
      .json({
        msg: "Datos incompletos (name)",
      });

  const toUpdate = {
    name: name,
  };
  const options = optionalToUpdate(toUpdate);

  // el tipo ya existe?
  const is = await UnitOfMeasurement.findOne({ name });
  if (is) return res.status(400).json({ msg: "El tipo ya existe" });

  try {
    const data = new UnitOfMeasurement(options);
    await data.save();
    return res.status(201).json(data);
  } catch (_) {
    return res.status(400).json({ msg: "Error de registro" });
  }
}

export const putMeasurement =  async(req: Request, res: Response) => {
  const { id, name } = req.body as IUpdateUnitOfMeasurement;

if (!id) return res.status(400).json({ msg: "Se requiere id" });

const toUpdate = {
  name: name
};

const options = optionalToUpdate(toUpdate);

if (Object.keys(options).length == 0)
  return res
    .status(400)
    .json({ msg: "Datos erroneos (name)" });

try {
  const data = await UnitOfMeasurement.findByIdAndUpdate(id, options, {
    new: true,
  });
  return res.status(200).json(data);
} catch (_) {
  return res.status(400).json({ msg: "Error de registro" });
}
}
