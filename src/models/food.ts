import { model, Schema, Types } from "mongoose";

export interface IFood {
  id?: Types.ObjectId;
  name?: String;
  desc?: number;
  stock?: number;
  stockFlag?: number;
  unit?: Types.ObjectId;
}

const food: Schema = new Schema(
  {
    add:{
      type:Boolean,
      required:true
    },amount:{
      type:Number
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Food = model<IFood>("Food", food);