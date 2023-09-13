import { JwtPayload, sign, verify } from "jsonwebtoken";
import config from "../config/config";


export const createToken = (object: Object, days:number):string => sign(object, config.jwtSecret,{
  expiresIn: 86400*days
});

interface IVerifiedToken {
  token: boolean;
  res?:JwtPayload;
}

export const verifiedToken = (token:string):IVerifiedToken => {
  try {
    const decodedToken = verify(token,config.jwtSecret) as JwtPayload
    return {token:true, res: decodedToken}
  } catch (_) {
    return {token:false}
  }
}

export const stringExtractor = (parr:string, toExtract:string ):string =>{
  const regularEx = new RegExp(toExtract, "i")
  return parr.replace(regularEx, "");
}

export const optionalToUpdate = (ops: Record<string, unknown>): Record<string, unknown> => {
  
  const toUpdate: Record<string, unknown> = {};

  Object.keys(ops).forEach((key) => {
    if(ops[key] !== undefined) toUpdate[key] = ops[key]
  });

  return toUpdate;
};

export const objectsToSrings = (arr:Array<object>)=>{

}