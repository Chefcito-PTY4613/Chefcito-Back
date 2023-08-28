import { model, Schema, Document, Types } from "mongoose";

export interface ITable extends Document{
    _id: Types.ObjectId,
    num: number;
    size: number;
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
    timestamps:false,
    versionKey:false
});

export default model<ITable>('Table',tableSchema)