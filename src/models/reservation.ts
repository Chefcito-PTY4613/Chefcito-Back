import { model, Schema, Document, Types } from "mongoose";
import { Table } from "./table";
import { Sale, ISale } from "./sale";
import { SaleStatus } from "./types/saleStatus";
import { io } from "../app";

export interface IReservation extends Document {
  id?: Types.ObjectId;
  table?: Types.ObjectId;
  user?: Types.ObjectId;
  active?: boolean;
}

const ReservationSchema: Schema = new Schema(
  {
    table: {
      ref: "Table",
      required: true,
      type: Schema.Types.ObjectId,
    },
    user: {
      ref: "User",
      required: true,
      type: Schema.Types.ObjectId,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
// trigger mesa
ReservationSchema.pre<IReservation>("save", async function (next) {
  const reservation: IReservation = this;
  const table =  await Table.findByIdAndUpdate(
    reservation.table,
    { active: false },
    { new: true }
  );
  io.emit('table:save',table)
  next();
});
ReservationSchema.post<IReservation>(
  "save",
  async function (doc: IReservation, next) {
    if (!doc) return next();

    const status = await SaleStatus.findOne({ name: "Iniciada" });
    const newSale: ISale = { reservation: doc.id, status: status?.id,};

    const sale = new Sale(newSale);
    await sale.save();

    next()
  }
);

export const Reservation = model<IReservation>(
  "Reservation",
  ReservationSchema
);
