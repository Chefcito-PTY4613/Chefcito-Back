import { model, Schema, Document, Types } from "mongoose";
import { io } from "../app";

export interface ITable{
    id?: Types.ObjectId,
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
tableSchema.post('save', function(doc) {
    const table = this
    io.emit('table:save',table)
})


export const Table = model<ITable>('Table',tableSchema)