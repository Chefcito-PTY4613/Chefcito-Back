import { Request, Response } from "express";
import { optionalToUpdate, regexSearch } from "../libs/fn.ratapan";
import { IFood, Food } from "../models/food";
import { uploadImageToS3 } from "../config/R2.config";
import { Recipe } from "../models/recipe";
import { io } from "../app";
import { Ingredient } from "../models/igredient";

export const getFood = async (req: Request, res: Response) => {
  try {
    if (req.query?.id) {
      const food = (await Food.findById(req.query?.id)) as IFood;
      if (food) {
        const recipe = await Recipe.find({ food: food.id })
          .populate("ingredient")
          .populate("process");
        return res.status(200).json({ food, recipe });
      }
      return res.status(400).json({ msg: "ha ocurrido un error" });
    }
    const data = await Food.find();
    res.json(data);
  } catch (error) {
    res.status(400).json({ msg: "Ha ocurrido un erro" });
  }
};

export const getFullData = async (req: Request, res: Response) => {
    try {
        const foods = await Food.find()
            .populate('type')

        const ingrdients = await Ingredient.find()
            .populate('unit')

        const recipes = await Recipe.find()
            .populate("ingredient")
            .populate("process");

      res.status(200).json({foods, ingrdients, recipes});
    } catch (error) {
      res.status(400).json({ msg: "Ha ocurrido un erro" });
    }
}


export const getFoodPagination = async (req: Request, res: Response) => {
  if (!req.query?.page)
    return res.status(400).json({ msg: 'Se necesita el parametro "page"' });
  const page = req.query.page as string;
  const pageInt = parseInt(page, 10);
  

  //page es un numero?
  if (isNaN(pageInt) || pageInt < 1) {
    res.status(400).json({ msg: "Page no es un numero valido" });
    return;
  }

  const limit: number = 6;

  //byName
  if (req.query?.name) {
    const data = await Food.find({
      name: regexSearch(`${req.query.name}`),
    })
      .limit(limit)
      .skip((pageInt - 1) * limit)
      .sort({ name: 1 });

    const dataCount = await Food.countDocuments({
      name: regexSearch(`${req.query.name}`),
    });

    if (data)
      return res.status(200).json({
        data,
        totalPages: Math.ceil(dataCount / limit),
        currentPage: pageInt,
        total: dataCount,
      });
    return res.status(400).json({ msg: "El comida con este nombre no existe" });
  }

  const data = await Food.find()
    .limit(limit)
    .skip((pageInt - 1) * limit)
    .sort({ name: 1 });

  const dataCount = await Food.countDocuments();

  return res.status(200).json({
    data,
    totalPages: Math.ceil(dataCount / limit),
    currentPage: pageInt,
    total: dataCount,
  });
};

export const postFood = async (req: Request, res: Response) => {
  const { name, desc, price, type } = req.body as IFood;
  const img = req.file?.buffer;

  if (!name || !desc || !img || !price || !type)
    return res.status(400).json({
      msg: "Datos incompletos (name, desc, img, price, type)",
    });

  const priceToInt = parseInt(`${price}`, 10);
  if (isNaN(priceToInt) || priceToInt < 1) {
    res.status(400).json({ msg: "Precio no es un numero valido" });
    return;
  }

  const toUpdate = {
    name: name,
    desc: desc,
    img: "http://placekitten.com/200/300",
    price: priceToInt,
    type: type,
  };
  const options = optionalToUpdate(toUpdate);

  // la comida ya existe?
  const is = await Food.findOne({ name });
  if (is) return res.status(400).json({ msg: "La comida ya existe" });

  const data = new Food(options);

  try {
    await data.save();

    const respS3 = await uploadImageToS3(img, "foods", `${data._id}.webp`);

    if (respS3.url === null)
      return res
        .status(400)
        .json({ msg: "Hubo un problema con la imagen, ve que sea un png" });

    data.img = respS3.url;

    await data.save();
    io.emit('food:save',data)
    return res.status(201).json(data);
  } catch (_) {
    return res.status(400).json({ msg: "Error de registro" });
  }
};

export const putFood = async (req: Request, res: Response) => {
  const { id, name, desc, price, type } = req.body as IFood;
  const img =  req.file?.buffer;
  if (!id) return res.status(400).json({ msg: "Se requiere id" });

  const toUpdate = {
    name: name,
    desc: desc,
    price: price,
    type: type,
  };

  const options = optionalToUpdate(toUpdate);

  try {
    let food = await Food.findById(id);

    if (!food) return res.status(404).json({ msg: "Comida no encontrada" });

    if (img) {
      const respS3 = await uploadImageToS3(img, "foods", `${id}.webp`);
      console.log(respS3)
      if(respS3.url)
      options.img = respS3.url;
    }

    const data = await Food.findByIdAndUpdate(id, options, { new: true });
io.emit('food:save',data)
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ msg: "Error del servidor" });
  }
};
