import { model, Schema, Document, Types } from "mongoose";
import { IRecipe, Recipe } from "./recipe";
import { IMovement, Movement } from "./movement";
import { IMovementType, MovementType } from "./types/movementType";
import { IFood } from "./food";

export interface IOrder extends Document {
  id?: Types.ObjectId;
  food?: Types.ObjectId;
  sale?: Types.ObjectId;
  desc?: string;
  status?:Types.ObjectId;
}
export interface IOrderFood extends Document {
  id?: Types.ObjectId;
  food?: IFood;
  sale?: Types.ObjectId;
  desc?: string;
  status?:Types.ObjectId;
}

const OrderSchema: Schema = new Schema(
  {
    food:{
      ref: "Food",
      required: true,
      type: Schema.Types.ObjectId,
    },
    sale:{
      ref: "Sale",
      required: true,
      type: Schema.Types.ObjectId,
    },
    status:{
      ref: "OrderStatus",
      required: true,
      type: Schema.Types.ObjectId,
    },
    desc:{
      type: String
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);


OrderSchema.post<IOrder>("save", async function (doc: IOrder,next) {
  if (!doc.id) next();

  const steps  = await Recipe.find({food: doc.food}) as Array<IRecipe>
  const venta = await MovementType.findOne({ name:'Venta'}) as IMovementType
  if(steps.length == 0)next();

  const movements: Array<IMovement> =  steps.map(({ingredient, amount})=>(
    {
      add:         false
      ,amount:     amount
      ,order:      doc.id
      ,ingredient: ingredient
      ,type:       venta.id
    }
  ))

  for (const movement of movements) {
    console.log('---------------------------')
    await new Movement(movement).save();
  }

  next();
});




export const Order = model<IOrder>(
  "Order",
  OrderSchema
);
