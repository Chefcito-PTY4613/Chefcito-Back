import { sign, verify } from "jsonwebtoken";
import config from "../config/config";


export const createToken = (object: Object, days:number):string => sign(object, config.jwtSecret,{
  expiresIn: 86400*days
});

interface IVerifiedToken {
  token: boolean;
  res?: Object;
}

export const verifiedToken = (token:string):IVerifiedToken => {
  try {
    const decodedToken = verify(token,config.jwtSecret)
    return {token:true,res:decodedToken}
  } catch (_) {
    return {token:false}
  }
}

export const stringExtractor = (parr:string, toExtract:string ):string =>{
  const regularEx = new RegExp(toExtract, "i")
  return parr.replace(regularEx, "");
}