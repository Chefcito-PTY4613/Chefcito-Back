import { Request, Response } from "express";
import { UserType, IUserType } from "../models/userType";

export const createUserType = async (req: Request, res: Response) => {
  const { name, desc } = req.body;

  if (!name || !desc) res.status(400).json({ msg: "Datos incompletos" });

  // el tipo ya existe?
  const userType = await UserType.findOne({ name });
  if (userType) res.status(400).json({ msg: "El tipo ya existe" });

  const newUserType = new UserType({ name, desc });
  await newUserType.save();
  return res.status(201).json(newUserType);
};

export const updateUserType = (req: Request, res: Response) => {};

export const getUserType =  async(req: Request, res: Response) => {

};
