import { User, IUser } from "../models/user";
import { UserType, IUserType } from "../models/types/userType";
import { Table, ITable } from "../models/table";
import config from "../config/config";
import { SaleStatus, ISaleStatus } from "../models/types/saleStatus";
import { FoodType, IFoodType } from "../models/types/foodType";
import { MovementType, IMovementType } from "../models/types/movementType";
import { IProcessType, ProcessType } from "../models/types/process";
import { Ingredient, IIngredient } from "../models/igredient";
import {
  IUnitOfMeasurement,
  UnitOfMeasurement,
} from "../models/types/unitOfMeasurement";
import { Food, IFood } from "../models/food";
import { IRecipe, Recipe } from "../models/recipe";
import { IOrderStatus, OrderStatus } from "../models/types/orderStatus";

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
  const admin = await User.findOne({ mail: config.DB.USER });
  if (admin) return;

  const adminType = await UserType.findOne({ name: "admin" });

  if (!adminType) console.log('No existe el tipo de usuario "admin"');

  if (adminType?.id) {
    const userAdmin = {
      name: config.DB.USER,
      lastName: config.DB.USER,
      mail: config.DB.USER,
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
      name: "",
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

const setFood = async () => {
  const data = await Food.find().limit(3);
  if (data.length !== 0) return;
  const type = (await FoodType.find().limit(3)) as Array<IFoodType>;
  const breackfast = type.find(({ name }) => name == "Desayuno");
  const mealt = type.find(({ name }) => name == "Almuerzo");
  const combo = type.find(({ name }) => name == "Combo");

  const foods: Array<IFood> = [
    {
      name: "Huevos estrellados",
      desc: "Occaecat officia aliquip consequat eiusmod elit commodo aliqua occaecat eiusmod aliquip nulla elit. Labore sit proident nisi officia eiusmod velit irure et tempor sunt.",
      img: "https://placebear.com/360/360",
      price: 1000,
      type: breackfast?.id
    },
    {
      name: "Pan con palta",
      desc: "Pariatur reprehenderit do elit ipsum nulla mollit dolor minim irure tempor ex cupidatat ad. Qui id ipsum nostrud amet duis ea non ad nulla enim.",
      img: "https://placebear.com/355/355",
      price: 1200,
      type: breackfast?.id,
    },
    {
      name: "Pollo con arroz",
      desc: "Pariatur reprehenderit do elit ipsum nulla mollit dolor minim irure tempor ex cupidatat ad. Qui id ipsum nostrud amet duis ea non ad nulla enim.",
      img: "https://placekitten.com/355/355",
      price: 4000,
      type: mealt?.id,
    },
    {
      name: "Gohan",
      desc: "Pariatur reprehenderit do elit ipsum nulla mollit dolor minim irure tempor ex cupidatat ad. Qui id ipsum nostrud amet duis ea non ad nulla enim.",
      img: "https://placekitten.com/355/355",
      price: 3200,
      type: mealt?.id,
    },
    {
      name: "Pan con huevo y cafe",
      desc: "Pariatur reprehenderit do elit ipsum nulla mollit dolor minim irure tempor ex cupidatat ad. Qui id ipsum nostrud amet duis ea non ad nulla enim.",
      img: "https://placebeard.it/640x360",
      price: 3500,
      type: combo?.id,
    },
    {
      name: "2 Churrascos y 2 Bebidas",
      desc: "Pariatur reprehenderit do elit ipsum nulla mollit dolor minim irure tempor ex cupidatat ad.",
      img: "https://placebeard.it/640x360",
      price: 5800,
      type: combo?.id,
    },
  ];
  Food.insertMany(foods);
};

const setMovementType = async () => {
  const data = await MovementType.find();

  if (data.length >= 4) return;

  const movementTypes: Array<IMovementType> = [
    {
      name: "Reponer",
    },
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
  const data = await ProcessType.find();
  if (data.length >= 5) return;
  const process: Array<IProcessType> = [
    {
      name: "Cafetera",
    },
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

const setMeasurement = async () => {
  const data = await UnitOfMeasurement.find();
  if (data.length >= 6) return;

  const unitOfMeasurement: Array<IUnitOfMeasurement> = [
    {
      name: "unidad",
    },
    {
      name: "gr",
    },
    {
      name: "ml",
    },
    {
      name: "mg",
    },
    {
      name: "mm",
    },
    {
      name: "cc",
    },
  ];
  UnitOfMeasurement.insertMany(unitOfMeasurement);
};

type IUnits = "gr" | "ml" | "mg" | "mm" | "cc" | "unidad";

const setIngredients = async () => {
  const data = await Ingredient.find().limit(8);
  const dataUnit =
    (await UnitOfMeasurement.find()) as Array<IUnitOfMeasurement>;

  const getUnit = (unit: IUnits) => {
    const objt = dataUnit.find(({ name }) => name == unit);
    if (objt) return objt.id;
  };
  const mil = (num: number) => num * 1000;
  if (data.length >= 7) return;

  const ingredientList: Array<IIngredient> = [
    {
      name: "Sal",
      desc: "Sacos de sal",
      unit: getUnit("gr"),
      stock: mil(300),
      stockFlag: mil(50),
    },
    {
      name: "azucar",
      desc: "Sacos de azucar",
      unit: getUnit("gr"),
      stock: mil(300),
      stockFlag: mil(50),
    },
    {
      name: "Papa",
      desc: "Ingrediente multi funcional",
      unit: getUnit("gr"),
      stock: mil(500),
      stockFlag: mil(50),
    },
    {
      name: "cafe",
      desc: "Cafe Marley tostado medio con notas de cacao",
      unit: getUnit("gr"),
      stock: mil(100),
      stockFlag: mil(10),
    },
    {
      name: "huevo",
      desc: "Huvos de granjas locales",
      unit: getUnit("unidad"),
      stock: 800,
      stockFlag: 250,
    },
    {
      name: "Pan",
      desc: 'Pan de panaderias "Juanito", de el horno a la mesa',
      unit: getUnit("unidad"),
      stock: 800,
      stockFlag: 250,
    },
    {
      name: "Aceite",
      desc: "Aceite de girasol",
      unit: getUnit("ml"),
      stock: mil(100),
      stockFlag: mil(25),
    },
  ];

  Ingredient.insertMany(ingredientList);
};

const setRecipe = async () => {
  const data = await Recipe.find().limit(3);
  if (data.length !== 0) return;

  const food = (await Food.findOne({ name: "Pan con huevo y cafe" })) as IFood;

  const sal = (await Ingredient.findOne({ name: "Sal" })) as IIngredient;
  const cafe = (await Ingredient.findOne({ name: "cafe" })) as IIngredient;
  const pan = (await Ingredient.findOne({ name: "Pan" })) as IIngredient;
  const huevo = (await Ingredient.findOne({ name: "huevo" })) as IIngredient;
  const aceite = (await Ingredient.findOne({ name: "Aceite" })) as IIngredient;

  const plancha = (await ProcessType.findOne({name: "Plancha",})) as IProcessType;
  const cafetera = (await ProcessType.findOne({name: "Cafetera",})) as IProcessType;

  const recipeList: Array<IRecipe> = [
    {
      food: food.id,
      ingredient: sal.id,
      process: plancha.id,
      amount: 10,
    },
    {
      food: food.id,
      ingredient: cafe.id,
      process: cafetera.id,
      amount: 30,
    },
    {
      food: food.id,
      ingredient: pan.id,
      process: plancha.id,
      amount: 2,
    },
    {
      food: food.id,
      ingredient: huevo.id,
      process: plancha.id,
      amount: 2,
    },
    {
      food: food.id,
      ingredient: aceite.id,
      process: plancha.id,
      amount: 50,
    },
  ];
  Recipe.insertMany(recipeList);
};

const setOrderStatus = async () => {
  const data = await OrderStatus.find();
  if (data.length >= 4) return;

  const orderStatus: Array<IOrderStatus> = [
    {
      name: "Ordenado",
    },
    {
      name: "Orden Lista",
    },
    {
      name: "Entregado",
    },
    {
      name: "Cancelado",
    }
  ];
  OrderStatus.insertMany(orderStatus);
};


export default [
  setUserTypes,
  setAdmin,
  setTables,
  setSaleStatus,
  setFoodType,
  setMovementType,
  setProcess,
  setMeasurement,
  setFood,
  setIngredients,
  setRecipe,
  setOrderStatus,
];
