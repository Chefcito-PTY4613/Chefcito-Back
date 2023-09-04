import { Request, Response } from "express";
import { IMovementType, IUpdateMovementType, MovementType } from "../../models/types/movementType";
import { optionalToUpdate } from "../../libs/fn.ratapan";

export const getMovementType =  async(req: Request, res: Response) => {
  try {
    const movementTypes = await MovementType.find()
    res.json({movementTypes})
  } catch (error) {
    res.status(400).json({msg:'Ha ocurrido un erro'})
  }
}

export const postMovementType =  async(req: Request, res: Response) => {
  const { name } = req.body as IMovementType;

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
  const movementType = await MovementType.findOne({ name });
  if (movementType) return res.status(400).json({ msg: "El tipo ya existe" });

  try {
    const newMovementType = new MovementType(options);
    await newMovementType.save();
    return res.status(201).json(newMovementType);
  } catch (_) {
    return res.status(400).json({ msg: "Error de registro" });
  }
}

export const putMovementType =  async(req: Request, res: Response) => {
  const { id, name } =
    req.body as IUpdateMovementType;

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
    const newMovementType = await MovementType.findByIdAndUpdate(id, options, {
      new: true,
    });
    return res.status(200).json(newMovementType);
  } catch (_) {
    return res.status(400).json({ msg: "Error de registro" });
  }
}
