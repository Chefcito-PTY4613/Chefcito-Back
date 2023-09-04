import { Request, Response } from "express";
import { ISaleStatus, IUpdateSaleStatus, SaleStatus } from "../../models/types/saleStatus";
import { optionalToUpdate } from "../../libs/fn.ratapan";

export const getSaleStatus =  async(req: Request, res: Response) => {
  try {
    const saleStatus = await SaleStatus.find()
    res.json({saleStatus})
  } catch (error) {
    res.status(400).json({msg:'Ha ocurrido un erro'})
  }
}

export const postSaleStatus =  async(req: Request, res: Response) => {
  const { name } = req.body as ISaleStatus;

  if (!name)
    return res
      .status(400)
      .json({
        msg: "Datos incompletos (name)",
      });

  const toUpdate = {
    name: name,
  };
  const options = optionalToUpdate(toUpdate);

  // el tipo ya existe?
  const saleStatus = await SaleStatus.findOne({ name });
  if (saleStatus) return res.status(400).json({ msg: "El tipo ya existe" });

  try {
    const newSaleStatus = new SaleStatus(options);
    await newSaleStatus.save();
    return res.status(201).json(newSaleStatus);
  } catch (_) {
    return res.status(400).json({ msg: "Error de registro" });
  }
}

export const putSaleStatus =  async(req: Request, res: Response) => {
  const { id, name } =
  req.body as IUpdateSaleStatus;

if (!id) return res.status(400).json({ msg: "Se requiere id" });

const toUpdate = {
  name: name
};

const options = optionalToUpdate(toUpdate);

if (Object.keys(options).length == 0)
  return res
    .status(400)
    .json({ msg: "Datos erroneos (name)" });

try {
  const newSaleStatus = await SaleStatus.findByIdAndUpdate(id, options, {
    new: true,
  });
  return res.status(200).json(newSaleStatus);
} catch (_) {
  return res.status(400).json({ msg: "Error de registro" });
}
}
