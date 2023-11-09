import { model, Schema, Types } from "mongoose";
import { Ingredient, IIngredient } from "./igredient";
import { io } from "../app";

export interface IMovement {
  id?: Types.ObjectId;
  add?: Boolean;
  amount?: number;
  order?: Types.ObjectId;
  ingredient?: Types.ObjectId;
  type?: Types.ObjectId;
}

const movement: Schema = new Schema(
  {
    add: {
      type: Boolean,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    ingredient: {
      ref: "Ingredient",
      required: true,
      type: Schema.Types.ObjectId,
    },
    order: {
      ref: "Order",
      type: Schema.Types.ObjectId,
    },
    type: {
      ref: "MovementType",
      required: true,
      type: Schema.Types.ObjectId,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

movement.pre<IMovement>("save", async function (next) {
  const { ingredient, amount, add }: IMovement = this;
  
  const filter = (await Ingredient.findById(ingredient)) as IIngredient;
  if (!filter.stock || !amount) return next();

  const ingredientChange = await Ingredient.findByIdAndUpdate(
    ingredient,
    {stock: add ? filter.stock + amount : filter.stock - amount},
    {returnOriginal: false});

  io.emit('ingredient:changeStock',ingredientChange)
});

export const Movement = model<IMovement>("Movement", movement);
