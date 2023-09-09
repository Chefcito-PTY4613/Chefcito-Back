import { Request, Response } from "express";
import { optionalToUpdate } from "../libs/fn.ratapan";
import { Movement,IMovement } from "../models/movement";
import { IUpdateMovementType, MovementType } from "../models/types/movementType";


export const getMovement = async (req: Request, res: Response) => {
  try {
    const data = await Movement.find();
    res.json(data);
  } catch (error) {
    res.status(400).json({ msg: "Ha ocurrido un erro" });
  }
};

export const postMovement = async (req: Request, res: Response) => {
  const { add, amount, ingredient, type } = req.body as IMovement;

  if ( !add || !amount || !ingredient || !type)
    return res.status(400).json({
      msg: "Datos incompletos (add, amount, ingredient, type)",
    });

  const toUpdate = {
    add:add, 
    amount:amount, 
    ingredient:ingredient, 
    type:type
  };
  const options = optionalToUpdate(toUpdate);

  // el tipo ya existe?
  const is = await MovementType.findOne({ type:type }) as IUpdateMovementType ;
  if (is.name === 'Merma') return res.status(400).json({ msg: "El tipo ya existe" });

  try {
    const data = new Movement(options);
    await data.save();
    return res.status(201).json(data);
  } catch (_) {
    return res.status(400).json({ msg: "Error de registro" });
  }
};

export const putMovement = async (req: Request, res: Response) => {
  const { id, add, amount, ingredient, type } = req.body as IMovement;

  if (!id) return res.status(400).json({ msg: "Se requiere id" });

  const toUpdate = {
    add:add, 
    amount:amount, 
    ingredient:ingredient, 
    type:type
  };

  const options = optionalToUpdate(toUpdate);

  if (Object.keys(options).length == 0)
    return res.status(400).json({ msg: "Datos erroneos ( add, amount, ingredient, type )" });

  try {
    const data = await Movement.findByIdAndUpdate(id, options, {
      new: true,
    });
    return res.status(200).json(data);
  } catch (_) {
    return res.status(400).json({ msg: "Error de registro" });
  }
};
