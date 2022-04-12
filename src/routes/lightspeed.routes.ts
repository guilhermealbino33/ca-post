import { Router } from "express";
import { CategoryController } from "modules/LightSpeed/useCases/categoryController";
import { GetItemsController } from "modules/LightSpeed/useCases/getItemsController";

const lightSpeedRoutes = Router();
const categoryController = new CategoryController();
const productController = new GetItemsController();

lightSpeedRoutes.post("/categories", categoryController.handle);
lightSpeedRoutes.get("/items", productController.handle);

export { lightSpeedRoutes };
