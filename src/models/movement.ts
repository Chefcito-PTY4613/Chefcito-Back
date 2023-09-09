import { model, Schema, Types } from "mongoose";

export interface IMovement {
  id?: Types.ObjectId;
  add?: Boolean;
  amount?: number;
  ingredient?: Types.ObjectId;
  type?: Types.ObjectId;
}

const movement: Schema = new Schema(
  {
    add:{
      type:Boolean,
      required:true
    },
    amount:{
      type:Number,
      required:true
    },
    ingredient:{
        ref:"Ingredient",
        required:true,
        type: Schema.Types.ObjectId
    },
    type:{
      ref:"MovementType",
      required:true,
      type: Schema.Types.ObjectId
  }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Movement = model<IMovement>("Movement", movement);