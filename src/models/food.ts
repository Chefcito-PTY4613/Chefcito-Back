import { model, Schema, Types } from "mongoose";

export interface IFood {
  id?: Types.ObjectId;
  name?: string;
  desc?: string;
  price?: number;
  img?: string;
  type?: Types.ObjectId;
}

const food: Schema = new Schema(
  {
    name:{
      type:String,
      required:true,
      unique:true
    },
    desc:{
      type:String,
      required:true,
    },
    price:{
      type:Number,
      required:true,
    },
    img:{
      type:String,
      required:true,
    },
    type:{
      required:true,
      ref:"FoodType",
      type:Types.ObjectId
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Food = model<IFood>("Food", food);