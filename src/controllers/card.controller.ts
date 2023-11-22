import { Request, Response } from "express";
import { User, IUserAndType } from "../models/user";
import { Card, ICard } from "../models/card";
import { sendMail } from "../config/mail.config";

export const createCard = async (req: Request, res: Response) => {
  const user = req.user as IUserAndType;
  const { name, pan, fecha, triple } = req.body as ICard;

  // están los datos?
  if (!name || !pan || !fecha || !triple || !user)
    return res.status(400).json({ msg: "Datos incompletos" });

  try {
    const newCard = new User({ name, pan, fecha, triple, user });
    newCard.save();
    return res.status(201).json(newCard);
  } catch {
    return res.status(400).json({ msg: "Error al guardar" });
  }
};

export const deleteCard = async (req: Request, res: Response) => {
  const user = req.user as IUserAndType;
  if (req.params?.id) {
    const id = req.params.id as string;
    try {
      const card = (await Card.findById(id)) as ICard;
      if (!card) return res.status(400).json({ msg: "La tarjeta no existe" });
      if (card.id !== user.id)
        return res.status(400).json({ msg: "Esta no es tu tarjeta" });
      await Card.findByIdAndDelete(id);

      return res.status(204).json({ msg: "Tarjeta eliminada" });
    } catch (error) {
      res.status(400).json({ msg: "Error al eliminar" });
    }
  }
  res.status(400).json({ msg: "No me enviaste in id 😐" });
};

export const getCard = async (req: Request, res: Response) => {
  const user = req.user as IUserAndType;
  try {
    if (user.userType.name !== "admin")
      return await Card.find({ user: user.id });

    if (!req.query?.page)
      return res.status(400).json({ msg: 'Se necesita el parametro "page"' });
      const page = req.query.page as string;
      const pageInt = parseInt(page, 10);
      if (isNaN(pageInt) || pageInt < 1)
        return res.status(400).json({ msg: "Page no es un numero valido" });

    const limit: number = 6;

    const data = await Card.find()
      .populate('user')
      .limit(limit)
      .skip((pageInt - 1) * limit)
      .sort({ user: 1 });

    const dataCount = await Card.countDocuments();

    return res.status(200).json({
      data,
      totalPages: Math.ceil(dataCount / limit),
      currentPage: pageInt,
      total: dataCount,
    });
  } catch (error) {
    return res.status(400).json({ msg: "Error de busqueda" });
  }
};
