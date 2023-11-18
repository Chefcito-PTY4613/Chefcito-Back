import { Router } from "express";
import passport from "passport";
import {
  getFood,
  getFoodPagination,
  getFullData,
  postFood,
  putFood,
} from "../controllers/food.controller";
import { isAdminOrStore } from "../middlewares/isUserType";
import { uploadFile } from "../middlewares/multer";

const foodRouter = Router();

foodRouter.get("/food", getFood);
// foodRouter.get("/food/full", getFullData); //SoloTest



foodRouter.get(
  "/food/pagination",
  passport.authenticate("jwt", { session: false }),
  getFoodPagination
);
foodRouter.post(
  "/food",
  [
    uploadFile.single("img"),
    passport.authenticate("jwt", { session: false }),
    isAdminOrStore,
  ],
  postFood
);
foodRouter.put(
  "/food",
  [
    uploadFile.single("img"),
    passport.authenticate("jwt", { session: false }),
    isAdminOrStore,
  ],
  putFood
);

export default foodRouter;
