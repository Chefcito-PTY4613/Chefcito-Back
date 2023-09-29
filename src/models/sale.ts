import { model, Schema, Types } from "mongoose";

export interface ISale {
  id?: Types.ObjectId;
  reservation?: Types.ObjectId;
  status?: Types.ObjectId;
  total?: number;
  payTime?: Date;
}

const SaleSchema: Schema = new Schema(
  {
    reservation:{
      ref: "Reservation",
      required: true,
      type: Schema.Types.ObjectId,
    },
    status:{
      ref: "SaleStatus",
      required: true,
      type: Schema.Types.ObjectId,
    },
    total:{
      type: Number,
      min:0
    },
    payTime:{
      type: Date
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Sale = model<ISale>(
  "Sale",
  SaleSchema
);
