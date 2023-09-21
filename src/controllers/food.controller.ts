import { Request, Response } from "express";
import { optionalToUpdate } from "../libs/fn.ratapan";
import { IFood, Food } from "../models/food";

export const getFood = async (req: Request, res: Response) => {
  try {
    const data = await Food.find();
    res.json(data);
  } catch (error) {
    res.status(400).json({ msg: "Ha ocurrido un erro" });
  }
};

export const postFood = async (req: Request, res: Response) => {
  const { name, desc, img, price, type } = req.body as IFood;

  if (!name || !desc || !img|| !price|| !type)
    return res.status(400).json({
      msg: "Datos incompletos (name, desc, img, price, type)",
    });

  const toUpdate = {
    name: name,
    desc: desc,
    img:img, 
    price:price, 
    type:type
  };
  const options = optionalToUpdate(toUpdate);

  // el tipo ya existe?
  const is = await Food.findOne({ name });
  if (is) return res.status(400).json({ msg: "La comida ya existe" });

  try {
    const data = new Food(options);
    await data.save();
    return res.status(201).json(data);
  } catch (_) {
    return res.status(400).json({ msg: "Error de registro" });
  }
};

export const putFood = async (req: Request, res: Response) => {
  const { id, name, desc, img, price, type } = req.body as IFood;

  if (!id) return res.status(400).json({ msg: "Se requiere id" });

  const toUpdate = {
    name: name,
    desc: desc,
    img:img, 
    price:price, 
    type:type
  };

  const options = optionalToUpdate(toUpdate);

  if (Object.keys(options).length == 0)
    return res.status(400).json({ msg: "Datos erroneos (name desc img price type)" });

  try {
    const data = await Food.findByIdAndUpdate(id, options, {
      new: true,
    });
    return res.status(200).json(data);
  } catch (_) {
    return res.status(400).json({ msg: "Error de registro" });
  }
};