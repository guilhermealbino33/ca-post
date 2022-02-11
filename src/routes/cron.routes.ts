import { Router } from "express";
import { ImageController } from "modules/Cron/imageController";
import { ProductController } from "modules/Cron/productController";

const cronRoutes = Router();
const productController = new ProductController();
const imageController = new ImageController();

cronRoutes.post("/", productController.products);
cronRoutes.post("/images", imageController.images);

export { cronRoutes };
