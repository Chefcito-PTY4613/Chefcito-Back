import { Request, Response } from "express";
import { IRecipe, Recipe } from "../models/recipe";

export const getRecipe = async (req: Request, res: Response) => {
  if (req.params?.id) {
    try {
      const data = await Recipe.find({ food: req.params.id })
        .populate("ingredient")
        .populate("process")
        .sort({name:1});
      return res.status(200).json(data);
    } catch (error) {
      res.status(400).json({ msg: "Error al buscar" });
    }
  }
  res.status(400).json({ msg: "No me enviaste in id 😐" });
};

export const createRecipe = async (req: Request, res: Response) => {
  const { food, amount, ingredient, process } = req.body as IRecipe;
  if (!food || !amount || !ingredient || !process)
  return res.status(400).json({msg: "Datos incompletos (food, amount, ingredient, process)"});
  const options = {
    food: food,
    amount: amount,
    ingredient: ingredient,
    process: process,
  };
    try {
      const data = new Recipe(options);
      await data.save()
      return res.status(201).json(await Recipe.findById(data._id).populate('ingredient').populate('process'));

    } catch (error) {
      return res.status(400).json({ msg: "Error al crear" });
    }
};

export const delRecipe = async (req: Request, res: Response) => {
  if (req.params?.id) {
    try {
      const data = await Recipe.findByIdAndDelete(req.params.id);
      return res.status(204).json(data);
    } catch (error) {
      res.status(400).json({ msg: "Error al buscar" });
    }
  }
  res.status(400).json({ msg: "No me enviaste in id 😐" });
};
