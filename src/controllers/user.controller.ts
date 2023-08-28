import { Request, Response } from "express";
import User, { IUser, ILogin } from "../models/user";
import UserType, { IUserType } from "../models/userType";
import { sign } from "jsonwebtoken";
import config from "../config/config";

const createToken = (user: IUser)=>  sign({id:user.id, mail:user.mail}, config.jwtSecret,{
    expiresIn: 86400
});

export const signup = async (req: Request, res: Response) => {
  const { mail, password, name, lastName } = req.body;

  // están los datos?
  if (!mail || !password || !name || !lastName)
    return res.status(400).json({ msg: "Datos incompletos" });

  // el usuario ya existe?
  const user = await User.findOne({ mail });
  if (user) return res.status(400).json({ msg: "El usuario ya existe" });

  const typeUser = await UserType.findOne({ name: "customer" });

  const newCustomer = new User({
    mail,
    password,
    name,
    lastName,
    userType: typeUser?._id,
  });
  newCustomer.save();

  return res.status(201).json(newCustomer);
};

export const login = async (req: Request, res: Response) => {
  const { mail, password }: ILogin = req.body;

  // están los datos?
  if (!mail || !password) res.status(400).json({ msg: "Datos incompletos" });

  // el usuario ya existe?
  const user = await User.findOne({ mail });
  if (!user) return res.status(400).json({ msg: "El usuario no existe" });

  console.log("Validando");
  const isMatch = await user?.comparePassword(password);

  if (!isMatch) return res.status(401).json({ msg: "Conteseña invalida" });

  return res.status(200).json({ token: createToken(user) });
};
