import { Router } from "express";
import { CategoryController } from "modules/LightSpeed/useCases/categoryController";
import { ProductController } from "modules/LightSpeed/useCases/productController";

const lightSpeedRoutes = Router();
const categoryController = new CategoryController();
const productController = new ProductController();

lightSpeedRoutes.post("/categories", categoryController.handle);
lightSpeedRoutes.get("/products", productController.handle);

export { lightSpeedRoutes };
