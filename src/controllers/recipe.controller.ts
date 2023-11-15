import { Request, Response } from "express";
import { Recipe } from "../models/recipe";



export const getRecipe= async (req: Request, res: Response) => {
  if (req.params?.id){
    try {
      const data = await Recipe.find({ food: req.params.id })
      .populate("ingredient")
      .populate("process");
      return res.status(200).json(data)
    } catch (error) {
      res.status(400).json({ msg: "Error al buscar" });
    }

  }
  res.status(400).json({ msg: "No me enviaste in id 😐" });
};

export const delRecipe = async (req: Request, res: Response) => {
  if (req.params?.id){
    try {
      const data = await Recipe.findByIdAndDelete(req.params.id)
      return res.status(204).json(data)
    } catch (error) {
      res.status(400).json({ msg: "Error al buscar" });
    }

  }
  res.status(400).json({ msg: "No me enviaste in id 😐" });

};