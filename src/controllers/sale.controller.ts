import { Request, Response } from "express";
import { Sale, ISale } from "../models/sale";
import { Table } from "../models/table";
import { IOrderFood, Order } from "../models/order";
import { IOrderStatus, OrderStatus } from "../models/types/orderStatus";
import { IReservation, Reservation } from "../models/reservation";

import { ISaleStatus, SaleStatus } from "../models/types/saleStatus";
import { io } from "../app";


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
      }, { new: true })
      const table = await Table.findByIdAndUpdate(
        reservationData.table,
        { active: true },
        { new: true }
        );
        await Sale.findByIdAndUpdate(saleData.id,{
          status:saleStatusData.id,
          total,
          payTime: new Date()
        })
        
    io.emit('table:save',table)
        
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

    }, { new: true })
    const table = await Table.findByIdAndUpdate(
      reservationData.table,
      { active: true },
      { new: true }
    );
    await Sale.findByIdAndUpdate(saleData.id,{
      status:saleStatusData.id,
      total,
      payTime: new Date()
    })

    io.emit('table:save',table)
    return res.status(200).json({msg:'Venta realizada'})


  } catch (error) {
    return res.status(400).json({msg:'Error de busqueda'})
  }
}

const terminator = async()=>{
  const saleStatusData = await SaleStatus.findOne({name:'Pagada'}) as ISaleStatus;
  
  const sales = await Sale.find({status:{ $ne: saleStatusData.id }}) as Array<ISale>;
  const reservations = await Reservation.find({active:true}) as Array<IReservation>;

  sales.forEach(async ( {id} )=>  {
    await Sale.findByIdAndUpdate(id,{status:saleStatusData.id,})
    console.log('Sale:',id)
  })
  reservations.forEach( async ({id})=>{ 
    await Reservation.findByIdAndUpdate(id,{active:false  }, { new: true })
    console.log('Reservation:',id)
  })
}
//terminator()

//{
//  "reservation": {
//    "table": "64f8ea7e5f0db14541aa7f75",
//    "user": "651db8bd309027b12f40381d",
//    "active": true,
//    "_id": "655114e5edc32eb6024bc6e8",
//    "createdAt": "2023-11-12T18:09:41.859Z",
//    "updatedAt": "2023-11-12T18:09:41.859Z"
//  },
//  "sale": {
//    "_id": "655114e6edc32eb6024bc6ec",
//    "reservation": "655114e5edc32eb6024bc6e8",
//    "status": "64f8ea7e5f0db14541aa7f69",
//    "createdAt": "2023-11-12T18:09:42.519Z",
//    "updatedAt": "2023-11-12T18:09:42.519Z"
//  }
//}