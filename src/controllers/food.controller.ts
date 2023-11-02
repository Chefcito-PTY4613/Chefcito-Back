import { Request, Response } from "express";
import { optionalToUpdate } from "../libs/fn.ratapan";
import { IFood, Food } from "../models/food";
import { uploadImageToS3 } from "../config/R2.config";

export const getFood = async (req: Request, res: Response) => {
  try {
    if (req.query?.id){
      const data = await Food.findById(req.query?.id)
      if(data) return res.status(200).json(data);
      return res.status(400).json({msg:'ha ocurrido un error'})
    }
    const data = await Food.find();
    res.json(data);
  } catch (error) {
    res.status(400).json({ msg: "Ha ocurrido un erro" });
  }
};

export const postFood = async (req: Request, res: Response) => {
  const { name, nameFile, desc, price, type } = req.body as IFood;
  const img = req.file?.buffer;

  if (!name || !desc || !img|| !price|| !type || !nameFile)
    return res.status(400).json({
      msg: "Datos incompletos (name, nameFile, desc, img, price, type)",
  });

const respS3 = await uploadImageToS3(img,'foods',nameFile)
  if (respS3.url === null)
    return res.status(400).json({msg: "Hubo un problema con la imagen, ve que sea un png",});

  const toUpdate = {
    name: name,
    desc: desc,
    img:respS3.url, 
    price:price, 
    type:type
  };
  const options = optionalToUpdate(toUpdate);

  // la comida ya existe?
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