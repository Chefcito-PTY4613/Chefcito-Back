import { Request, Response } from "express";
import { User, IUser } from "../models/user";
import { UserType } from "../models/types/userType";
import {
  createToken,
  verifiedToken
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

export const mailToChange = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id ) return res.status(400).json({ msg: "Datos incompletos" });

  const user = await User.findById(id) as IUser
  if(!user)  return res.status(400).json({ msg: "El usuario no existe" });

  const tokenVal = createToken({ id, validate: true }, 1);
  const verif = checkupMail(`${user.name} ${user.lastName}`, tokenVal);

  await sendMail(user.mail, `Verificacion de correo Chefcito`, verif);

  return res.status(201).json({ msg: "Correo enviado" });
}

export const passChange = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { currentPassword, newPassword }: { currentPassword: string; newPassword: string } = req.body;

  // Verificar que ambos campos estén presentes
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ msg: "Falta la contraseña actual o la nueva contraseña" });
  }

  // Verificar que la nueva contraseña no sea igual a la actual
  if (currentPassword === newPassword) {
    return res.status(400).json({ msg: "La nueva contraseña debe ser diferente a la contraseña actual" });
  }

  // Validar la nueva contraseña según las políticas de contraseñas (longitud, caracteres especiales, etc.)

  // Encuentra el usuario por ID
  const user = await User.findById(id);

  // Verificar que el usuario exista
  if (!user) {
    return res.status(404).json({ msg: "Usuario no encontrado" });
  }

  // Verificar la contraseña actual
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    return res.status(401).json({ msg: "Contraseña actual incorrecta" });
  }

  // Guardar la nueva contraseña cifrada
  user.password = newPassword;
  await user.save();

  // Responder que el cambio de contraseña fue exitoso
  return res.status(200).json({ msg: "Contraseña actualizada con éxito" });
};

