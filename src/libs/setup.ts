import { User, IUser } from "../models/user";
import { UserType, IUserType } from "../models/userType";
import { Table, ITable } from "../models/table";
import config from "../config/config";

const setUserTypes = async () => {
  try {const userTypes: Array<IUserType> = [
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
  await UserType.insertMany(userTypes);}
  catch(_){
    return;
  }
};

const setAdmin = async () => {
  if (await User.findOne({ mail: "javier2000asr@gmail.com" })) return;

  const adminType = await UserType.findOne({ name: "admin" });

  if (!adminType) console.log('No existe el tipo de usuario "admin"');

  if (adminType?._id) {
    const userAdmin = {
      name: config.DB.USER,
      lastName: config.DB.USER,
      mail: "javier2000asr@gmail.com",
      password: config.DB.PASS,
      userType: adminType._id,
    };
    const admin: IUser = new User(userAdmin);
    admin.save();
  }
};

const setTables = async () => {
  const tableOne = await Table.find({num:1});

  if(tableOne.length !== 0 ) return;
  const tables:Array<ITable> = [
    {
      num:1,
      size:2
    },{
      num:2,
      size:2
    },{
      num:3,
      size:4
    },{
      num:4,
      size:4
    },{
      num:5,
      size:6
    },{
      num:6,
      size:8
    },{
      num:7,
      size:8
    },{
      num:8,
      size:8
    }
  ]
  Table.insertMany(tables);
};

export default {
  setUserTypes, setAdmin, setTables
};
