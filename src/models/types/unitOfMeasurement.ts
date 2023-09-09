import { Schema, Types, model } from "mongoose";

export interface IUnitOfMeasurement{
    id?: Types.ObjectId,
    name:string,
}
export interface IUpdateUnitOfMeasurement{
    id: Types.ObjectId,
    name?:string,
}

const unitOfMeasurement:Schema = new Schema({
    name:{
        type: String,
        required:true,
        unique:true
    },
},{
    timestamps:false,
    versionKey:false
})

export const UnitOfMeasurement = model<IUnitOfMeasurement>('UnitOfMeasurement',unitOfMeasurement)
