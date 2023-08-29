import { Request, Response, response } from "express";
import { User, IUser } from "../models/user";
import { UserType, IUserType } from "../models/userType";
import { createToken, verifiedToken, stringExtractor } from "../libs/fn.ratapan";

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
  const { mail, password }: IUser = req.body;

  // están los datos?
  if (!mail || !password) res.status(400).json({ msg: "Datos incompletos" });

  // el usuario ya existe?
  const user = await User.findOne({ mail });
  if (!user) return res.status(400).json({ msg: "El usuario no existe" });

  if (user.comparePassword) {
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ msg: "Conteseña invalida" });
  }
  const token = createToken({ id: user.id, mail: user.mail }, 30);

  return res.status(200).json({ token });
};

export const getCustomers = async (req: Request, res: Response) => {
  if (!req.query?.id && !req.query?.page)
    return res
      .status(400)
      .json({ msg: 'Se necesita el parametro "id" o "page"' });

  //byId
  if (req.query?.id) {
    const user = await User.findById(req.query.id);
    if (user) return res.status(200).json({ user: user });
    return res.status(400).json({ msg: "El ususario con este id no existe" });
  }

  //customer Page
  const page = req.query.page as string;

  // El usuario tiene autorización en headers?
  if (!req.headers?.authorization)
    return res
      .status(400)
      .json({
        msg: "Se necesita autorización, para objetener datos paginados",
      });
  // El usuario tiene autorización?
  if (!verifiedToken(stringExtractor(req.headers.authorization, 'Bearer ')).token)
    return res
      .status(400)
      .json({ msg: "No autorizado o autorización caducada" });

  //page es un numero?

  const pageInt = parseInt(page, 10);
  if (isNaN(pageInt) || pageInt < 0) {
    res.status(400).json({ msg: "Page no es un numero valido" });
    return;
  }

  const typesUser = await UserType.findOne({ name: "customer" });
  if (!typesUser) {
    return res
      .status(400)
      .json({ msg: "El tipo de usuario clinete no existe" });
  }
  const limit: number = 10;

  const customers = await User.find({ userType: typesUser.id })
    .limit(limit)
    .skip((pageInt - 1) * limit)
    .sort({ createdAt: -1 });
  const customersCount = await User.countDocuments({ userType: typesUser.id });

  return res.status(200).json({
    customers,
    totalPages: Math.ceil(customersCount / limit),
    currentPage: pageInt,
    total: customersCount,
  });
};
