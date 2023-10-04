import { Schema, Types, model } from "mongoose";

export interface IOrderStatus{
    id?: Types.ObjectId,
    name:string,
}
export interface IUpdateOrderStatus{
    id: Types.ObjectId,
    name?:string,
}

const orderStatusSchema:Schema = new Schema({
    name:{
        type: String,
        required:true,
        unique:true
    },
},{
    timestamps:false,
    versionKey:false
})

export const OrderStatus = model<IOrderStatus>('OrderStatus',orderStatusSchema)
