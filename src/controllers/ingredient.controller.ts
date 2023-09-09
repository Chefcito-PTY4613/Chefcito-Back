import { Request, Response } from "express";
import { optionalToUpdate } from "../libs/fn.ratapan";
import { IIngredient, Ingredient } from "../models/igredient";

export const getIngredient = async (req: Request, res: Response) => {
  try {
    const data = await Ingredient.find();
    res.json(data);
  } catch (error) {
    res.status(400).json({ msg: "Ha ocurrido un erro" });
  }
};

export const postIngredient = async (req: Request, res: Response) => {
  const { name, desc, stock, stockFlag } = req.body as IIngredient;

  if (!name || !desc || !stock || !stockFlag)
    return res.status(400).json({
      msg: "Datos incompletos (name, desc, stock, stockFlag)",
    });

  const toUpdate = {
    name: name,
    desc: desc,
    stock: stock,
    stockFlag: stockFlag,
  };
  const options = optionalToUpdate(toUpdate);

  // el tipo ya existe?
  const is = await Ingredient.findOne({ name });
  if (is) return res.status(400).json({ msg: "El tipo ya existe" });

  try {
    const data = new Ingredient(options);
    await data.save();
    return res.status(201).json(data);
  } catch (_) {
    return res.status(400).json({ msg: "Error de registro" });
  }
};

export const putIngredient = async (req: Request, res: Response) => {
  const { id, name, desc, stock, stockFlag } = req.body as IIngredient;

  if (!id) return res.status(400).json({ msg: "Se requiere id" });

  const toUpdate = {
    name: name,
    desc: desc,
    stock: stock,
    stockFlag: stockFlag,
  };

  const options = optionalToUpdate(toUpdate);

  if (Object.keys(options).length == 0)
    return res.status(400).json({ msg: "Datos erroneos (name, desc, stock, stockFlag)" });

  try {
    const data = await Ingredient.findByIdAndUpdate(id, options, {
      new: true,
    });
    return res.status(200).json(data);
  } catch (_) {
    return res.status(400).json({ msg: "Error de registro" });
  }
};
