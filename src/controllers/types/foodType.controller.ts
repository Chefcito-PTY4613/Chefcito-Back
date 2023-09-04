import { Request, Response } from "express";
import {
  FoodType,
  IFoodType,
  IUpdateFoodType,
} from "../../models/types/foodType";
import { optionalToUpdate } from "../../libs/fn.ratapan";

export const getFoodType = async (req: Request, res: Response) => {
  try {
    const foodType = await FoodType.find();
    res.json({ foodType });
  } catch (error) {
    res.status(400).json({ msg: "Ha ocurrido un erro" });
  }
};

export const postFoodType = async (req: Request, res: Response) => {
  const { name, color, sheduleStart, sheduleEnd } = req.body as IFoodType;

  if (!name || !color || !sheduleStart || !sheduleEnd)
    return res
      .status(400)
      .json({
        msg: "Datos incompletos (name, color, sheduleStart, sheduleEnd)",
      });

  const toUpdate = {
    name: name,
    color: color,
    sheduleStart: sheduleStart,
    sheduleEnd: sheduleEnd,
  };
  const options = optionalToUpdate(toUpdate);

  // el tipo ya existe?
  const userType = await FoodType.findOne({ name });
  if (userType) return res.status(400).json({ msg: "El tipo ya existe" });

  try {
    const newFoodType = new FoodType(options);
    await newFoodType.save();
    return res.status(201).json(newFoodType);
  } catch (_) {
    return res.status(400).json({ msg: "Error de registro" });
  }
};

export const putFoodType = async (req: Request, res: Response) => {
  const { id, name, color, sheduleStart, sheduleEnd } =
    req.body as IUpdateFoodType;

  if (!id) return res.status(400).json({ msg: "Se requiere id" });

  const toUpdate = {
    name: name,
    color: color,
    sheduleStart: sheduleStart,
    sheduleEnd: sheduleEnd,
  };

  const options = optionalToUpdate(toUpdate);

  if (Object.keys(options).length == 0)
    return res
      .status(400)
      .json({ msg: "Datos erroneos (name, color, sheduleStart, sheduleEnd)" });

  try {
    const newFoodType = await FoodType.findByIdAndUpdate(id, options, {
      new: true,
    });
    return res.status(200).json(newFoodType);
  } catch (_) {
    return res.status(400).json({ msg: "Error de registro" });
  }
};
