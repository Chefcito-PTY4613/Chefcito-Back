import { Request, Response } from "express";
import { Sale, ISale } from "../models/sale";
import { Table } from "../models/table";
import { IOrderFood, Order } from "../models/order";
import { IOrderStatus, OrderStatus } from "../models/types/orderStatus";
import { IReservation, Reservation } from "../models/reservation";

import { ISaleStatus, SaleStatus } from "../models/types/saleStatus";


export const paySale = async (req: Request, res: Response) => {
  let id:string
  if (req.params?.id){
    id = req.params.id;
  }else return res.status(400).json({msg:'Se necesita el ID de venta'})
  try {
    const saleData = await Sale.findById(id) as ISale
    if(!saleData?.id)return res.status(400).json({msg:'No existe una venta con este ID'})
    
    const reservationData = await Reservation.findById(saleData.reservation) as IReservation;
    if(!reservationData?.id)return res.status(400).json({msg:'No existe una reservación con esta venta'})
    
    const ordersData = await Order.find({sale:id}).populate('food') as Array<IOrderFood>;
    let setStatus = ordersData.length>0?'Pagada':'Cancelada';
    const orderStatusData = await OrderStatus.findOne({name:'Entregado'}) as IOrderStatus;
    const saleStatusData = await SaleStatus.findOne({name:setStatus}) as ISaleStatus;
    
    //venta forced
    let total = 0
    
    ordersData.forEach(async(order)=>{
      total += order.food?.price??0
      
      await Order.findByIdAndUpdate(
        order._id,
        { status: orderStatusData.id },
        { new: false }
        );
      })
      
      await Reservation.findByIdAndUpdate(reservationData.id,{
        active:false
        
      })
      await Table.findByIdAndUpdate(
        reservationData.table,
        { active: true },
        { new: true }
        );
        await Sale.findByIdAndUpdate(saleData.id,{
          status:saleStatusData.id,
          total,
          payTime: new Date()
        })
        
    let resp = ordersData.length>0?'Pago realizado':'Reserva cancelada';
    return res.status(200).json({msg:resp})


  } catch (error) {
    return res.status(400).json({msg:'Error de busqueda'})
  }
};

export const paySaleForced = async (req: Request, res: Response) => {
  let id:string
  if (req.params?.id){
    id = req.params.id;
  }else return res.status(400).json({msg:'Se necesita el ID de venta'})
  try {
    const saleData = await Sale.findById(id) as ISale
    if(!saleData?.id)return res.status(400).json({msg:'No existe una venta con este ID'})
    
    const reservationData = await Reservation.findById(saleData.reservation) as IReservation;
    if(!reservationData?.id)return res.status(400).json({msg:'No existe una reservación con esta venta'})
    
    const ordersData = await Order.find({sale:id}).populate('food') as Array<IOrderFood>;
    const orderStatusData = await OrderStatus.findOne({name:'Entregado'}) as IOrderStatus;
    const saleStatusData = await SaleStatus.findOne({name:'Pagada'}) as ISaleStatus;

    //venta forced
    let total = 0

    ordersData.forEach(async(order)=>{
      total += order.food?.price??0

      await Order.findByIdAndUpdate(
        order._id,
            { status: orderStatusData.id },
            { new: false }
          );
    })
    await Reservation.findByIdAndUpdate(reservationData.id,{
      active:false

    })
    await Table.findByIdAndUpdate(
      reservationData.table,
      { active: true },
      { new: true }
    );
    await Sale.findByIdAndUpdate(saleData.id,{
      status:saleStatusData.id,
      total,
      payTime: new Date()
    })

    return res.status(200).json({msg:'Venta realizada'})


  } catch (error) {
    return res.status(400).json({msg:'Error de busqueda'})
  }
}
