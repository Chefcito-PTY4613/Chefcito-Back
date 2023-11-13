import { Request, Response } from "express";
import { Order, IOrder } from "../models/order";
import { optionalToUpdate } from "../libs/fn.ratapan";
import { Food, IFood } from "../models/food";

export const getOrder = async (req: Request, res: Response) => {
  if (req.query?.id) {
    try {
      const data = await Order.findById(req.query?.id);
      if (data) return res.status(200).json(data);
      return res.status(400).json({ msg: "Ha ocurrido un error" });
    } catch (error) {
      return res.status(400).json({ msg: "La venta no existe" });
    }
  }

  const data = await Order.find();
  if (data) return res.status(200).json(data);
  return res.status(400).json({ msg: "Ha ocurrido un error" });
};

export const getOrderBySale = async (req: Request, res: Response) => {
  if (req.query?.id) {
    try {
      const data = await Order.find({ sale: req.query?.id }).populate("food");
      if (data) return res.status(200).json(data);
      return res.status(400).json({ msg: "Ha ocurrido un error" });
     
    } catch (error) {
      return res.status(400).json({ msg: "La venta no existe" });
    }
  }
  return res.status(400).json({ msg: "La venta no existe" });
};
export const getOrderManagement = async (req: Request, res: Response) => {
  return res.json(await Order.find());
};

export const getOrderById = async (req: Request, res: Response) => {
  if (req.params?.id) {
    try {
      const data = await Order.findById(req.params.id).populate("food");
      if (data) return res.status(200).json(data);
      return res.status(400).json({ msg: "Ha ocurrido un error" });
     
    } catch (error) {
      return res.status(400).json({ msg: "La venta no existe" });
    }
  }
  return res.status(400).json({ msg: "La se requiere el id" });
};

export const createOrder = async (req: Request, res: Response) => {
  const { food, sale, desc, status } = req.body as IOrder;

  if (!food || !sale || !status)
    return res
      .status(400)
      .json({ msg: "Datos incompletos (food,sale,status)" });
  const toUpdate = {
    food: food,
    sale: sale,
    desc: desc,
    status: status,
  };

  const options = optionalToUpdate(toUpdate);

  // la comida existe?
  const is = (await Food.findById(food)) as IFood;
  if (!is.id) return res.status(400).json({ msg: "La comida no existe" });

  try {
    const order: IOrder = new Order(options);
    await order.save();

    return res.status(201).json(order);
  } catch (_) {
    return res.status(400).json({ msg: "Error de registro" });
  }
};
