import { Router } from "express";
import { ProductController } from "modules/GoogleCron/productController";

const cronRoutes = Router();
const productController = new ProductController();

cronRoutes.post("/", productController.products);

export { cronRoutes };
