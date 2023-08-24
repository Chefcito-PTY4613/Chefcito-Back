import { Schema, model } from "mongoose";

export interface IUserType extends Document{
    name:string,
    desc:string,
}

const userTypeSchema = new Schema({
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
export default model<IUserType>('UserType',userTypeSchema)