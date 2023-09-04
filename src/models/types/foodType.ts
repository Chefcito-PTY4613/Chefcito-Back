import { Schema, Types, model } from "mongoose";

export interface IFoodType{
    id?: Types.ObjectId,
    name:string,
    color:string,
    sheduleStart:number,
    sheduleEnd:number,
}
export interface IUpdateFoodType{
  id: Types.ObjectId,
  name?:string,
  color?:string,
  sheduleStart?:number,
  sheduleEnd?:number,
}

const FoodTypeSchema:Schema = new Schema({
    name:{
        type: String,
        required:true,
        unique:true
    },
    color:{
      type: String,
      required:true,
      unique:true
  },
  sheduleStart:{
    type: Number,
    required:true,
    min: 0,
    max: 23
  },
  sheduleEnd:{
    type: Number,
    required:true,
    min: 0,
    max: 23
  }
},{
    timestamps:false,
    versionKey:false
})

export const FoodType = model<IFoodType>('FoodType',FoodTypeSchema)
