import { Request, Response } from "express";
import { optionalToUpdate, regexSearch } from "../libs/fn.ratapan";
import { IIngredient, Ingredient } from "../models/igredient";
import { io } from "../app";

export const getIngredient = async (req: Request, res: Response) => {
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
    const data = await Ingredient.find({
      name: regexSearch(`${req.query.name}`),
    })
      .limit(limit)
      .skip((pageInt - 1) * limit)
      .sort({ createdAt: -1 });

    const dataCount = await Ingredient.countDocuments({
      name: regexSearch(`${req.query.name}`),
    });

    if (data)
      return res.status(200).json({
        data,
        totalPages: Math.ceil(dataCount / limit),
        currentPage: pageInt,
        total: dataCount,
      });
    return res
      .status(400)
      .json({ msg: "El ingrediente con este nombre no existe" });
  }

  const data = await Ingredient.find()
    .limit(limit)
    .skip((pageInt - 1) * limit)
    .sort({ createdAt: -1 });

  const dataCount = await Ingredient.countDocuments();

  return res.status(200).json({
    data,
    totalPages: Math.ceil(dataCount / limit),
    currentPage: pageInt,
    total: dataCount,
  });
};

export const getIngredientRecipe = async (req: Request, res: Response) => {


  const limit: number = 5;

  //byName
  if (req.query?.name) {
    const data = await Ingredient.find({
      name: regexSearch(`${req.query.name}`),
    })
      .select("name unit")
      .limit(limit)
      .sort({ name: 1 })

    if (data)
      return res.status(200).json({
        data
      });
    return res
      .status(400)
      .json({ msg: "El ingrediente con este nombre no existe" });
  }

  const data = await Ingredient.find()
    .select("name unit")
    .limit(limit)
    .sort({ name: 1 });

  return res.status(200).json({
    data
  });
};

export const getIngredientStock = async (req: Request, res: Response) => {
  if (req.params?.id){
    try {
      const ingredient = await Ingredient.findById(req.params?.id).select({
        name:1,
        stock:1
      })
      return res.status(200).json({ingredient})
    } catch (error) {
      res.status(400).json({ msg: "Error al buscar" });
    }

  }
  res.status(400).json({ msg: "No me enviaste in id 😐" });
};

export const postIngredient = async (req: Request, res: Response) => {
  const { name, desc, unit, stock, stockFlag } = req.body as IIngredient;

  if (!name || !desc || !stock || !stockFlag || !unit)
    return res.status(400).json({
      msg: "Datos incompletos (name, desc, stock, unit, stockFlag)",
    });

  const toUpdate = {
    name: name,
    desc: desc,
    unit:unit,
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
    io.emit('ingredient:update',data)
    return res.status(201).json(data);
  } catch (_) {
    return res.status(400).json({ msg: "Error de registro" });
  }
};

export const putIngredient = async (req: Request, res: Response) => {
  console.log(req.body)
  const { id, name, unit, desc, stock, stockFlag } = req.body as IIngredient;

  if (!id) return res.status(400).json({ msg: "Se requiere id" });

  const toUpdate = {
    name: name,
    desc: desc,
    stock: stock,
    stockFlag: stockFlag,
    unit:unit,
  };

  const options = optionalToUpdate(toUpdate);

  if (Object.keys(options).length == 0)
    return res
      .status(400)
      .json({ msg: "Datos erroneos (name, desc, unit, stock, stockFlag)" });

  try {
    const data = await Ingredient.findByIdAndUpdate(id, options, {
      new: true,
    });
    io.emit('ingredient:update',data)
    return res.status(200).json(data);
  } catch (_) {
    return res.status(400).json({ msg: "Error de registro" });
  }
};
