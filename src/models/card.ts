import { model, Schema, Document, Types } from "mongoose";
import bcrypt from 'bcrypt';

export interface ICard extends Document {
  id?: Types.ObjectId;
  name: string;
  pan: string;
  fecha: Date; //  12/02
  triple: number;// 123
  user: Types.ObjectId | string;
  comparePan: (pan:string) => Promise<boolean>;
}

const cardSchema: Schema = new Schema(
  {
    name:{
      type: String,
      required: true,
    },
    pan:{
      type: String,
      minlength: 16,
      maxlength:16,
      unique:true,
      required: true,
    },
    fecha:{
      type: Date,
      required: true,
    },
    triple:{
      type: Number,
      min: 100,
      max: 999,
      required: true,
    },
    user: {
      ref: "User",
      required: true,
      type: Schema.Types.ObjectId,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

//cifrado de contraseña
cardSchema.pre<ICard>('save', async function (next){
  const card = this;

  if(!card.isModified('pan')) return next();

  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(card.pan,salt);
  card.pan = hash;
  next();
});

//comprobar de contraseña
cardSchema.methods.comparePan = async function (pan:string): Promise<boolean>{
  return await bcrypt.compare(pan, this.pan)
}

export const Card = model<ICard>(
  "Card",
  cardSchema
);
