import { Router } from "express";
import { CategoryController } from "modules/LightSpeed/useCases/categoryController";
import { ProductController } from "modules/LightSpeed/useCases/itemController";

const lightSpeedRoutes = Router();
const categoryController = new CategoryController();
const productController = new ProductController();

lightSpeedRoutes.post("/categories", categoryController.handle);
lightSpeedRoutes.get("/items", productController.handle);

export { lightSpeedRoutes };
