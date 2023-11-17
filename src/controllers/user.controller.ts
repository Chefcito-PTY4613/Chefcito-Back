import { Request, Response } from "express";
import { User, IUser, IUserWorker } from "../models/user";
import { IUserType, UserType } from "../models/types/userType";
import {
  createToken,
  verifiedToken,
  stringExtractor,
  optionalToUpdate,
  regexSearch,
} from "../libs/fn.ratapan";
import { sendMail } from "../config/mail.config";
import { checkupMail } from "../libs/templates/checkUpMail";
import checkUpResponse from "../libs/templates/checkUpResponse";

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
    userType: typeUser?.id,
  });
  newCustomer.save();

  
  const tokenVal = createToken({ id: newCustomer._id, validate: true }, 1);
  const verif = checkupMail(`${name} ${lastName}`, tokenVal);
  await sendMail(mail, `Verificacion de correo Chefcito`, verif);

  return res.status(201).json(newCustomer);
};

export const sendMailVerify = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, lastName, mail } = req.query as {name:string, lastName:string, mail:string}

  if (!id || !mail || !name || !lastName) return res.status(400).json({ msg: "Datos incompletos" });

  const tokenVal = createToken({ id, validate: true }, 1);
  const verif = checkupMail(`${name} ${lastName}`, tokenVal);
  await sendMail(mail, `Verificacion de correo Chefcito`, verif);

  return res.status(201).json({ msg: "Correo enviado" });
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
    if (!isMatch) return res.status(401).json({ msg: "Contraseña invalida" });
  }
  const token = createToken(
    { id: user.id, mail: user.mail, userType: user.userType },
    1
  );

  return res.status(200).json({ token, user });
};

export const checkup = async (req: Request, res: Response) => {
  try {
    const decoded = verifiedToken(req.params.validate);

    if (!decoded.token) {
      
      return res.status(400).send(checkUpResponse.badToken);
    }

    let user = decoded.res as IUser;
    await User.findByIdAndUpdate(user.id, { verified: true }, { new: true });

    res.status(200).send(checkUpResponse.good);
  } catch (error) {
    res.status(400).send(checkUpResponse.error);
  }
};



export const getCustomers = async (req: Request, res: Response) => {
  if (!req.query?.page)
    return res.status(400).json({ msg: 'Se necesita el parametro "page"' });

  //customer Page
  const page = req.query.page as string;

  const pageInt = parseInt(page, 10);

  // El usuario tiene autorización en headers?
  if (!req.headers?.authorization)
    return res.status(400).json({
      msg: "Se necesita autorización, para objetener datos paginados",
    });

  // El usuario tiene autorización?, tiene que ser un token valido y ademas ser admin
  const decodedToken = verifiedToken(
    stringExtractor(req.headers.authorization, "Bearer ")
  );
  const typeUser = await UserType.findById(decodedToken.res?.userType);
  if (!decodedToken.token || typeUser?.name !== "admin") {
    return res
      .status(400)
      .json({ msg: "No autorizado o autorización caducada" });
  }

  //page es un numero?
  if (isNaN(pageInt) || pageInt < 1) {
    res.status(400).json({ msg: "Page no es un numero valido" });
    return;
  }

  const typesUser = await UserType.findOne({ name: "customer" });

  if (!typesUser)
    return res
      .status(400)
      .json({ msg: "El tipo de usuario cliente no existe" });

  const limit: number = 6;
  //byName
  if (req.query?.name) {
    const customers = await User.find({
      name: regexSearch(`${req.query.name}`),
      userType: typesUser.id,
    })
      .limit(limit)
      .skip((pageInt - 1) * limit)
      .sort({ createdAt: -1 });

    const customersCount = await User.countDocuments({
      name: regexSearch(`${req.query.name}`),
      userType: typesUser.id,
    });

    if (customers)
      return res.status(200).json({
        data: customers,
        totalPages: Math.ceil(customersCount / limit),
        currentPage: pageInt,
        total: customersCount,
      });
    return res
      .status(400)
      .json({ msg: "El ususario con este nombre no existe" });
  }

  const customers = await User.find({ userType: typesUser.id })
    .limit(limit)
    .skip((pageInt - 1) * limit)
    .sort({ createdAt: -1 });

  const customersCount = await User.countDocuments({ userType: typesUser.id });

  return res.status(200).json({
    data: customers,
    totalPages: Math.ceil(customersCount / limit),
    currentPage: pageInt,
    total: customersCount,
  });
};

export const getWorker = async (req: Request, res: Response) => {
  if (!req.query?.page)
    return res.status(400).json({ msg: 'Se necesita el parametro "page"' });

  //customer Page
  const page = req.query.page as string;

  const pageInt = parseInt(page, 10);

  // El usuario tiene autorización en headers?
  if (!req.headers?.authorization)
    return res.status(400).json({
      msg: "Se necesita autorización, para objetener datos paginados",
    });

  // El usuario tiene autorización?, tiene que ser un token valido y ademas ser admin
  const decodedToken = verifiedToken(
    stringExtractor(req.headers.authorization, "Bearer ")
  );
  const typeUser = await UserType.findById(decodedToken.res?.userType);
  if (!decodedToken.token || typeUser?.name !== "admin") {
    return res
      .status(400)
      .json({ msg: "No autorizado o autorización caducada" });
  }

  //page es un numero?
  if (isNaN(pageInt) || pageInt < 1) {
    res.status(400).json({ msg: "Page no es un numero valido" });
    return;
  }

  const typesUser = await UserType.findOne({ name: "customer" });
  if (!typesUser)
    return res
      .status(400)
      .json({ msg: "El tipo de usuario cliente no existe" });

  const limit: number = 6;

  //byName
  if (req.query?.name) {
    const customers = await User.find({
      name: regexSearch(`${req.query.name}`),
      userType: { $ne: typesUser.id },
    })
      .limit(limit)
      .skip((pageInt - 1) * limit)
      .sort({ createdAt: -1 });

    const customersCount = await User.countDocuments({
      name: regexSearch(`${req.query.name}`),
      userType: { $ne: typesUser.id },
    });

    if (customers)
      return res.status(200).json({
        data: customers,
        totalPages: Math.ceil(customersCount / limit),
        currentPage: pageInt,
        total: customersCount,
      });
    return res
      .status(400)
      .json({ msg: "El ususario con este nombre no existe" });
  }

  const customers = await User.find({ userType: { $ne: typesUser.id } })
    .limit(limit)
    .skip((pageInt - 1) * limit)
    .sort({ createdAt: -1 });

  const customersCount = await User.countDocuments({
    userType: { $ne: typesUser.id },
  });

  return res.status(200).json({
    data: customers,
    totalPages: Math.ceil(customersCount / limit),
    currentPage: pageInt,
    total: customersCount,
  });
};

export const postWorker = async (req: Request, res: Response) => {
  const { mail, password, name, lastName, phone, userType } =
    req.body as IUserWorker;

  // están los datos?
  if (!mail || !password || !name || !lastName || !userType) {
    return res.status(400).json({ msg: "Datos incompletos" });
  }
  // el usuario ya existe?
  const user = await User.findOne({ mail });
  if (user) return res.status(400).json({ msg: "El usuario ya existe" });

  const userWorkers = ["waiter", "finance", "chef", "store"];
  const userTypes = (await UserType.findById(userType)) as IUserType;

  if (!userWorkers.includes(userTypes?.name))
    return res
      .status(400)
      .json({ msg: "No se puede crear este tipo de usuario" });

  const toCreate = {
    mail: mail,
    password: password,
    name: name,
    lastName: lastName,
    userType: userType,
  };
  let phoneObj: Record<string, unknown> = {};
  if (phone !== undefined)
    if (phone?.number !== undefined && phone?.code !== undefined) {
      phoneObj["code"] = phone.code;
      phoneObj["number"] = phone?.number;
    }
  const options = optionalToUpdate(toCreate);

  const newWorker = new User({ ...options, phone: { ...phoneObj } });
  newWorker.save();

  return res.status(201).json(newWorker);
};
