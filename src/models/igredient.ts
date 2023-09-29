import { model, Schema, Types } from "mongoose";

export interface IIngredient {
  _id?: Types.ObjectId;
  id?: Types.ObjectId;
  name?: String;
  desc?: String;
  stock?: number;
  stockFlag?: number;
  unit?: Types.ObjectId;
}

const ingredient: Schema = new Schema(
  {
    name: {
      unique: true,
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      requierd: true,
      default: 0,
      min: 0,
    },
    stockFlag: {
      type: Number,
      requierd: true,
      default: 0,
      min: 0,
    },
    unit:{
        required:true,
        ref:"UnitOfMeasurement",
        type: Schema.Types.ObjectId
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Ingredient = model<IIngredient>("Ingredient", ingredient);
