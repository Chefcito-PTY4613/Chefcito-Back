import { Schema, Types, model } from "mongoose";

export interface IMovementType{
    id?: Types.ObjectId,
    name:string,
}
export interface IUpdateMovementType{
    id: Types.ObjectId,
    name?:string,
}

const movementTypeSchema:Schema = new Schema({
    name:{
        type: String,
        required:true,
        unique:true
    },
},{
    timestamps:false,
    versionKey:false
})

export const MovementType = model<IMovementType>('MovementType',movementTypeSchema)
