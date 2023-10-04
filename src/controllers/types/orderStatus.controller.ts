import { Request, Response } from "express";
import { IOrderStatus, IUpdateOrderStatus, OrderStatus } from "../../models/types/orderStatus";
import { optionalToUpdate } from "../../libs/fn.ratapan";

export const getOrderStatus =  async(req: Request, res: Response) => {
  try {
    const data = await OrderStatus.find()
    res.status(200).json(data)
  } catch (error) {
    res.status(400).json({msg:'Ha ocurrido un erro'})
  }
}

export const postOrderStatus =  async(req: Request, res: Response) => {
  const { name } = req.body as IOrderStatus;

  if (!name)
    return res
      .status(400)
      .json({
        msg: "Datos incompletos (name)",
      });

  const toUpdate = {
    name: name,
  };
  const options = optionalToUpdate(toUpdate);

  // el tipo ya existe?
  const orderStatus = await OrderStatus.findOne({ name });
  if (orderStatus) return res.status(400).json({ msg: "El tipo ya existe" });

  try {
    const data = new OrderStatus(options);
    await data.save();
    return res.status(201).json(data);
  } catch (_) {
    return res.status(400).json({ msg: "Error de registro" });
  }
}

export const putOrderStatus =  async(req: Request, res: Response) => {
  const { id, name } =
  req.body as IUpdateOrderStatus;

if (!id) return res.status(400).json({ msg: "Se requiere id" });

const toUpdate = {
  name: name
};

const options = optionalToUpdate(toUpdate);

if (Object.keys(options).length == 0)
  return res
    .status(400)
    .json({ msg: "Datos erroneos (name)" });

try {
  const data = await OrderStatus.findByIdAndUpdate(id, options, {
    new: true,
  });
  return res.status(200).json(data);
} catch (_) {
  return res.status(400).json({ msg: "Error de registro" });
}
}
