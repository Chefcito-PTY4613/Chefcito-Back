import { model, Schema, Document, Types } from "mongoose";

export interface ITable{
    _id?: Types.ObjectId,
    num: number;
    size: number;
    active?: boolean;
}

const tableSchema:Schema = new Schema({
    num: {
        unique:true,
        type:Number,
        required:true
    },
    size: {
        type:Number,
        required:true
    },
    active:{
        type: Boolean,
        default: true

    },
},{
    timestamps:true,
    versionKey:false
});

export const Table = model<ITable>('Table',tableSchema)