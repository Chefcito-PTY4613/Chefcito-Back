import { Schema, Types, model } from "mongoose";

export interface IProcessType{
    id?: Types.ObjectId,
    name?:string,
}
export interface IUpdateProcessType{
    id: Types.ObjectId,
    name?:string,
}

const processTypeSchema:Schema = new Schema({
    name:{
        type: String,
        required:true,
        unique:true
    },
},{
    timestamps:false,
    versionKey:false
})

export const ProcessType = model<IProcessType>('ProcessType',processTypeSchema)
