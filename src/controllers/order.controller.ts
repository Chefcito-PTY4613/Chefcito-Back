import { Request, Response } from "express";
import { Order, IOrder } from "../models/order";
import { optionalToUpdate } from "../libs/fn.ratapan";
import { Food, IFood } from "../models/food";
import { OrderStatus } from "../models/types/orderStatus";
import { io } from "../app";
import { Recipe } from "../models/recipe";

export const getOrder = async (req: Request, res: Response) => {
  if (req.query?.type) {
    try {
      if (req.query?.type) {
        const orders = (await Order.find({ status: req.query?.type })
          .populate({
            path: "food",
            select: "_id name img",
          })
          .populate({
            path: "sale",
            populate: {
              path: "reservation",
              populate: {
                path: "table",
                select: "_id num",
              },
            },
          })) as {
          _id: string;
          food: { _id: string };
          sale: {
            id: string;
            reservation: {
              id: string;
              table: {
                _id: string;
                num: number;
                size: number;
                active: boolean;
              };
              user: string;
              active: boolean;
            };
            status: string;
            total: number;
            payTime: Date;
          };
          desc: string;
          status: string;
        }[];

        const orderDetails = await Promise.all(
          orders.map(async (order) => {
            const tableId =
              order?.sale?.reservation?.table._id.toString() ?? "Unknown Table"; // Use nullish coalescing (??) if _id could be undefined
            const foodId = order.food?._id;

            if (!foodId) {
              throw new Error("Food ID not found");
            }

            const recipes = (await Recipe.find({ food: foodId }).populate({
              path: "ingredient",
              select: "name process amount unit",
              populate:{
                path: "unit",
                select: "name",
              }
            })) as {
              _id: string;
              process: string;
              ingredient: { unit:{name:string}, name: string };
              amount: number;
            }[];

            // Map recipes, checking for undefined ingredient
            const recipeDetails = recipes.map(
              ({ _id, process, ingredient, amount }) => {
                const ingredientName = ingredient.name || "Unknown Ingredient";
                const unit = ingredient.unit.name || "Unknown Ingredient";
                return {
                  _id,
                  amount,
                  process,
                  ingredient: ingredientName,
                  unit
                };
              }
            );

            return {
              order,
              tableId,
              recipes: recipeDetails,
            };
          })
        );

        return res.status(200).json(orderDetails);
      }
    } catch (error) {
      return res.status(400).json({ msg: "Tipo no existe" });
    }
  }

  if (req.query?.id) {
    try {
      const data = await Order.findById(req.query?.id);
      if (data) return res.status(200).json(data);
      return res.status(400).json({ msg: "Ha ocurrido un error" });
    } catch (error) {
      return res.status(400).json({ msg: "La venta no existe" });
    }
  }

  const data = await Order.find().limit(50);
  if (data) return res.status(200).json(data);
  return res.status(400).json({ msg: "Ha ocurrido un error" });
};

export const getOrderBySale = async (req: Request, res: Response) => {
  if (req.params?.id) {
    try {
      const data = await Order.find({ sale: req.params?.id }).populate("food");
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
    io.emit("updatedOrder", order);
    return res.status(201).json(order);
  } catch (_) {
    return res.status(400).json({ msg: "Error de registro" });
  }
};

export const updateStatusOrder = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body as IOrder;

  if (!id) return res.status(400).json({ msg: "Se necesita id" });

  if (!status)
    return res.status(400).json({ msg: "Datos incompletos (status)" });

  // la comida existe?
  const is = (await OrderStatus.findById(status)) as IFood;
  if (!is.id) return res.status(400).json({ msg: "El estado no existe" });

  try {
    const order = (await Order.findById(id)) as IOrder;
    if (!order) return res.status(400).json({ msg: "La orden no exite" });

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate("status");

    io.emit("updatedOrder", updatedOrder);

    return res.status(201).json(updatedOrder);
  } catch (_) {
    return res.status(400).json({ msg: "Error de registro" });
  }
};
