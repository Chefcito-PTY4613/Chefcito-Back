import { model, Schema, Document, Types } from "mongoose";
import bcrypt from 'bcrypt';

export interface IUser extends Document{
    name:string;
    lastName:string;
    mail:string;
    password:string;
    phone?:{
        code:string,
        number:number
    };
    userType:Types.ObjectId;
    comparePassword:(password:string)=> Promise<boolean>;
}

export interface ILogin extends Document{
    mail:string;
    password:string;
    comparePassword:(password:string)=> Promise<boolean>;
}

const userSchema:Schema = new Schema({
    name: {
        type:String,
        required:true
    },
    lastName: {
        type:String,
        required:true
    },
    active:{
        type: Boolean,
        default: true

    },
    mail: {
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    password: {
        type:String,
        required:true
    },
    verified: {
        type:Boolean,
        default: false
    },
    phone:{
        code:String,
        number:{
            type: Number,
            min: 100000000,
            max: 999999999
        }
    },
    userType:{
        ref:"UserType",
        required:true,
        type: Schema.Types.ObjectId
    }

},{
    timestamps:true,
    versionKey:false
});
//cifrado de contraseña
userSchema.pre<IUser>('save', async function (next){
    const user = this;
    if(!user.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(user.password,salt);
    user.password = hash;
    next();
});

//comprobar de contraseña
userSchema.methods.comparePassword = async function (password:string): Promise<boolean>{
    return await bcrypt.compare(password, this.password)
}

export default model<IUser>('User',userSchema)