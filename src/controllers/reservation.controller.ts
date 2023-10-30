import { Request, Response } from "express";
import { IReservation, Reservation } from "../models/reservation";
import { optionalToUpdate } from "../libs/fn.ratapan";
import { Sale, ISale } from "../models/sale";
import { ITable, Table } from "../models/table";
import { IOrder, Order } from "../models/order";

export const getReservation = async (req: Request, res: Response) => {
  return res.json(await Reservation.find());
};
export const getReservationManagement = async (req: Request, res: Response) => {
  const { table } = req.body as IReservation;

  const reservation = (await Reservation.findOne({ table })) as IReservation;

  const sale = (await Sale.findOne({ reservation: reservation.id })) as ISale;

  const orders = await Order.find({ sale: sale.id })
    .populate("food")
    .populate("status",'name');

  return res.json({ reservation, sale, orders });
};

export const createReservation = async (req: Request, res: Response) => {
  const { table, user } = req.body as IReservation;

  if (!table || !user)
    return res.status(400).json({
      msg: "Datos incompletos (table, user)",
    });
  const toUpdate = {
    table: table,
    user: user,
  };

  const options = optionalToUpdate(toUpdate);

  // el tipo ya existe?
  const is = (await Table.findById(table)) as ITable;
  if (is.active === false)
    return res.status(400).json({ msg: "La mesa esta en uso" });

  try {
    const reservation: IReservation = new Reservation(options);
    await reservation.save();

    const sale = await Sale.findOne({ reservation: reservation.id });

    return res.status(201).json({ reservation, sale });
  } catch (_) {
    return res.status(400).json({ msg: "Error de registro" });
  }

  // {
  //   "reservation": {
  //     "table": "64f8ea7e5f0db14541aa7f7a",
  //     "user": "64f8ea7f5f0db14541aa7f82",
  //     "active": true,
  //     "_id": "65148313911ed77cb50b471e",
  //     "createdAt": "2023-09-27T19:31:31.971Z",
  //     "updatedAt": "2023-09-27T19:31:31.971Z"
  //   },
  //   "sale": {
  //     "_id": "65148314911ed77cb50b4722",
  //     "reservation": "65148313911ed77cb50b471e",
  //     "status": "64f8ea7e5f0db14541aa7f69",
  //     "createdAt": "2023-09-27T19:31:32.614Z",
  //     "updatedAt": "2023-09-27T19:31:32.614Z"
  //   }
  // }
};

export const cancelReservation = async (req: Request, res: Response) => {};

export const finishReservation = async (req: Request, res: Response) => {};
