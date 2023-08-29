import { Schema, Types, model } from "mongoose";

export interface IUserType{
    _id?: Types.ObjectId,
    name:string,
    desc:string,
}

const userTypeSchema:Schema = new Schema({
    name:{
        type: String,
        required:true,
        unique:true
    },
    desc:{
        type: String,
        required:true
    }
},{
    timestamps:true,
    versionKey:false
})
export const UserType = model<IUserType>('UserType',userTypeSchema)