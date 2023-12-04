import { Request, Response } from "express";
import { Sale, ISale } from "../models/sale";
import { Table } from "../models/table";
import { IOrder, IOrderFood, Order } from "../models/order";
import { IOrderStatus, OrderStatus } from "../models/types/orderStatus";
import { IReservation, Reservation } from "../models/reservation";

import { ISaleStatus, SaleStatus } from "../models/types/saleStatus";
import { io } from "../app";
import { comfirmPay } from "../libs/templates/comfirmPay";
import { sendMail } from "../config/mail.config";
import { IUser } from "../models/user";
import orderRouter from "../routes/order.router";

export const paySale = async (req: Request, res: Response) => {
  const { tip } = req.body;
  const user = req.user as IUser;

  const pageInt = parseInt(tip, 10);
  let propina = 0;
  if (!isNaN(pageInt)) propina = pageInt;

  let id: string;
  if (req.params?.id) {
    id = req.params.id;
  } else return res.status(400).json({ msg: "Se necesita el ID de venta" });

  try {
    const saleData = (await Sale.findById(id)) as ISale;
    if (!saleData?.id)
      return res.status(400).json({ msg: "No existe una venta con este ID" });

    const reservationData = (await Reservation.findById(
      saleData.reservation
    )) as IReservation;
    if (!reservationData?.id)
      return res
        .status(400)
        .json({ msg: "No existe una reservación con esta venta" });

    const ordersData = (await Order.find({ sale: id }).populate(
      "food"
    )) as Array<IOrderFood>;
    let setStatus = ordersData.length > 0 ? "Pagada" : "Cancelada";
    const orderStatusData = (await OrderStatus.findOne({
      name: "Entregado",
    })) as IOrderStatus;
    const saleStatusData = (await SaleStatus.findOne({
      name: setStatus,
    })) as ISaleStatus;

    //venta forced
    let total = 0;

    ordersData.forEach(async (order) => {
      total += order.food?.price ?? 0;
      await Order.findByIdAndUpdate(
        order._id,
        { status: orderStatusData.id },
        { new: false }
      );
    });

    await Reservation.findByIdAndUpdate(
      reservationData.id,
      {
        active: false,
      },
      { new: true }
    );
    const table = await Table.findByIdAndUpdate(
      reservationData.table,
      { active: true },
      { new: true }
    );
    await Sale.findByIdAndUpdate(saleData.id, {
      status: saleStatusData.id,
      total: total + propina,
      payTime: new Date(),
    });

    io.emit("table:save", table);

    let resp = ordersData.length > 0 ? "Pago realizado" : "Reserva cancelada";

    const resultForMail = ordersData.reduce((accumulator, current) => {
      const foodName = current.food?.name;
      if (!foodName) return accumulator; // Si no hay nombre, ignora este elemento

      if (!accumulator[foodName]) {
        // Si este alimento aún no está en el acumulador, inicialízalo
        accumulator[foodName] = {
          name: foodName,
          cantidad: 1,
          monto: current.food?.price || 0,
        };
      } else {
        // Si ya está, actualiza la cantidad y el monto
        accumulator[foodName].cantidad += 1;
        accumulator[foodName].monto += current.food?.price || 0;
      }

      return accumulator;
    }, {} as Record<string, { name: string; cantidad: number; monto: number }>);

    sendMail(
      user.mail,
      "Confirmación de Pago",
      comfirmPay({
        details: Object.values(resultForMail),
        name: user.name,
        endTime: Date().toString(),
        propina: tip,
        total,
      })
    );

    return res.status(200).json({ msg: resp });
  } catch (error) {
    return res.status(400).json({ msg: "Error de busqueda" });
  }
};

export const paySaleForced = async (req: Request, res: Response) => {
  let id: string;
  if (req.params?.id) {
    id = req.params.id;
  } else return res.status(400).json({ msg: "Se necesita el ID de venta" });
  try {
    const saleData = (await Sale.findById(id)) as ISale;
    if (!saleData?.id)
      return res.status(400).json({ msg: "No existe una venta con este ID" });

    const reservationData = (await Reservation.findById(
      saleData.reservation
    )) as IReservation;
    if (!reservationData?.id)
      return res
        .status(400)
        .json({ msg: "No existe una reservación con esta venta" });

    const ordersData = (await Order.find({ sale: id }).populate(
      "food"
    )) as Array<IOrderFood>;
    const orderStatusData = (await OrderStatus.findOne({
      name: "Entregado",
    })) as IOrderStatus;
    const saleStatusData = (await SaleStatus.findOne({
      name: "Pagada",
    })) as ISaleStatus;

    //venta forced
    let total = 0;

    ordersData.forEach(async (order) => {
      total += order.food?.price ?? 0;

      await Order.findByIdAndUpdate(
        order._id,
        { status: orderStatusData.id },
        { new: false }
      );
    });
    await Reservation.findByIdAndUpdate(
      reservationData.id,
      {
        active: false,
      },
      { new: true }
    );
    const table = await Table.findByIdAndUpdate(
      reservationData.table,
      { active: true },
      { new: true }
    );
    await Sale.findByIdAndUpdate(saleData.id, {
      status: saleStatusData.id,
      total,
      payTime: new Date(),
    });

    io.emit("table:save", table);
    return res.status(200).json({ msg: "Venta realizada" });
  } catch (error) {
    return res.status(400).json({ msg: "Error de busqueda" });
  }
};

const terminator = async () => {
  const saleStatusData = (await SaleStatus.findOne({
    name: "Pagada",
  })) as ISaleStatus;

  const sales = (await Sale.find({
    status: { $ne: saleStatusData.id },
  })) as Array<ISale>;
  const reservations = (await Reservation.find({
    active: true,
  })) as Array<IReservation>;

  sales.forEach(async ({ id }) => {
    await Sale.findByIdAndUpdate(id, { status: saleStatusData.id });
    console.log("Sale:", id);
  });
  reservations.forEach(async ({ id }) => {
    await Reservation.findByIdAndUpdate(id, { active: false }, { new: true });
    console.log("Reservation:", id);
  });
};

const terminatorOrders = async () => {
  const orderData = (await Order.find({status:{ $ne: '651b2fdccdeb9672527e1d70'}})) as IOrder[];
  
  orderData.forEach( async ({_id})=>{
    await Order.findByIdAndUpdate(_id, { status: '651b2fdccdeb9672527e1d70' }, { new: true });
    console.log(_id)
    })
};