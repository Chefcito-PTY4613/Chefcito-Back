import { IUserAndType } from "../models/user";
import { Request, Response, NextFunction } from "express";

export const isAdmin = async (req:Request, res:Response, next:NextFunction) => {
  try {
    const user  = req.user as IUserAndType
    if (user.userType.name === "admin") {
      next();
      return;
    }
    return res.status(403).json({ message: "Require admin Role!" });
  } catch (error) {
    return res.status(500).send({ message: error });
  }
};
export const isAdminOrStore= async (req:Request, res:Response, next:NextFunction) =>{
  try {
    const user  = req.user as IUserAndType
    if (user.userType.name === "admin" || user.userType.name === "store") {
      next();
      return;
    }
    return res.status(403).json({ message: "Require admin or store Role!" });
  } catch (error) {
    return res.status(500).send({ message: error });
  }
}
export const isAdminOrWaiter= async (req:Request, res:Response, next:NextFunction) =>{
  try {
    const user  = req.user as IUserAndType
    if (user.userType.name === "admin" || user.userType.name === "waiter") {
      next();
      return;
    }
    return res.status(403).json({ message: "Require admin or waiter Role!" });
  } catch (error) {
    return res.status(500).send({ message: error });
  }
}

export const isCustomer = async (req:Request, res:Response, next:NextFunction) => {
  try {
    const user  = req.user as IUserAndType
    if (user.userType.name === "customer") {
      next();
      return;
    }
    return res.status(403).json({ message: "Require customer Role!" });
  } catch (error) {
    return res.status(500).send({ message: error });
  }
};

export const isFinance = async (req:Request, res:Response, next:NextFunction) => {
  try {
    const user  = req.user as IUserAndType
    if (user.userType.name === "finance") {
      next();
      return;
    }
    return res.status(403).json({ message: "Require finance Role!" });
  } catch (error) {
    return res.status(500).send({ message: error });
  }
};