import { User, IUser } from "../models/user";
import { UserType, IUserType } from "../models/types/userType";
import { Table, ITable } from "../models/table";
import config from "../config/config";
import {  SaleStatus, ISaleStatus } from "../models/types/saleStatus";
import { FoodType, IFoodType } from "../models/types/foodType";
import { MovementType, IMovementType } from "../models/types/movementType";
import { IProcessType, ProcessType } from "../models/types/process";

const setUserTypes = async () => {
  try {
    const userTypes: Array<IUserType> = [
      {
        name: "admin",
        desc: "Administrador",
      },
      {
        name: "customer",
        desc: "Cliente",
      },
      {
        name: "waiter",
        desc: "Mesero",
      },
      {
        name: "finance",
        desc: "Finanzas",
      },
      {
        name: "chef",
        desc: "Cocinero",
      },
      {
        name: "store",
        desc: "Bodega",
      },
    ];
    await UserType.insertMany(userTypes);
  } catch (_) {
    return;
  }
};

const setAdmin = async () => {
  const admin = await User.findOne({ mail: "javier2000asr@gmail.com" }) 
  if ( admin)return;

  const adminType = await UserType.findOne({ name: "admin" });

  if (!adminType) console.log('No existe el tipo de usuario "admin"');

  if (adminType?.id) {
    const userAdmin = {
      name: config.DB.USER,
      lastName: config.DB.USER,
      mail: "javier2000asr@gmail.com",
      password: config.DB.PASS,
      userType: adminType.id,
    };
    const admin: IUser = new User(userAdmin);
    admin.save();
  }
};

const setTables = async () => {
  const tableOne = await Table.find().limit(3);

  if (tableOne.length !== 0) return;
  const tables: Array<ITable> = [
    {
      num: 1,
      size: 2,
    },
    {
      num: 2,
      size: 2,
    },
    {
      num: 3,
      size: 4,
    },
    {
      num: 4,
      size: 4,
    },
    {
      num: 5,
      size: 6,
    },
    {
      num: 6,
      size: 8,
    },
    {
      num: 7,
      size: 8,
    },
    {
      num: 8,
      size: 8,
    },
  ];
  Table.insertMany(tables);
};

const setSaleStatus = async () => {
  const data = await SaleStatus.find().limit(3);

  if (data.length !== 0) return;
  const salesStatus: Array<ISaleStatus> = [
    {
      name: "Iniciada",
    },
    {
      name: "Por pagar",
    },
    {
      name: "Cancelada",
    },
    {
      name: "Pagada",
    },
  ];
  SaleStatus.insertMany(salesStatus);
};

const setFoodType = async () => {
  const data = await FoodType.find().limit(3);

  if (data.length !== 0) return;
  const foodTypes: Array<IFoodType> = [
    {
      name: "Desayuno",
      color: "#FAC78C",
      sheduleStart: 6,
      sheduleEnd: 13,
    },
    { 
      name: "Almuerzo",
      color: "#A090FF",
      sheduleStart: 12,
      sheduleEnd: 23,
    },
    {
      name: "Combo",
      color: "#E07593",
      sheduleStart: 12,
      sheduleEnd: 23,
    },
    {
      name: "Bebidas",
      color: "#90FACE",
      sheduleStart: 6,
      sheduleEnd: 23,
    },
  ];
  FoodType.insertMany(foodTypes);
};

const setMovementType = async () => {
  const data = await MovementType.find().limit(3);

  if (data.length  !== 0) return;


  const movementTypes: Array<IMovementType> = [
    {
      name: "Merma",
    },
    {
      name: "Venta",
    },
    {
      name: "Compra",
    },
  ];
  MovementType.insertMany(movementTypes);
};

const setProcess = async () => {
  const data = await ProcessType.find().limit(3);

  if (data.length  !== 0) return;


  const process: Array<IProcessType> = [
    {
      name: "Freidora",
    },
    {
      name: "Plancha",
    },
    {
      name: "Horno",
    },
    {
      name: "Quemadores",
    },
  ];
  ProcessType.insertMany(process);
};

export default {
  setUserTypes,
  setAdmin,
  setTables,
  setSaleStatus,
  setFoodType,
  setMovementType,
  setProcess
};
