import { model, Schema, Types } from "mongoose";

export interface IRecipe{
  id?: Types.ObjectId;
  food?: Types.ObjectId;
  ingredient?: Types.ObjectId;
  process?:Types.ObjectId,
  amount?: number;
}

const RecipeSchema: Schema = new Schema(
  {
    food:{
      ref: "Food",
      required: true,
      type: Schema.Types.ObjectId,
    },
    ingredient:{
      ref: "Ingredient",
      required: true,
      type: Schema.Types.ObjectId,
    },
    process:{
      ref: "ProcessType",
      required: true,
      type: Schema.Types.ObjectId,
    },
    amount:{
      type: Number,
      required: true,
      min:0
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

export const Recipe = model<IRecipe>(
  "Recipe",
  RecipeSchema
);
