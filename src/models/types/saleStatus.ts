import { Schema, Types, model } from "mongoose";

export interface ISaleStatus{
    id?: Types.ObjectId,
    name:string,
}
export interface IUpdateSaleStatus{
    id: Types.ObjectId,
    name?:string,
}

const saleStatusSchema:Schema = new Schema({
    name:{
        type: String,
        required:true,
        unique:true
    }
},{
    timestamps:false,
    versionKey:false
})

export const SaleStatus = model<ISaleStatus>('SaleStatus',saleStatusSchema)
