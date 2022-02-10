import { Router } from "express";
import { ImageController } from "modules/GoogleCron/imageController";
import { ProductController } from "modules/GoogleCron/productController";
import { ProductControllerBatch } from "modules/GoogleCron/productControllerBatch";

const cronRoutes = Router();
const productController = new ProductController();
const productControllerBatch = new ProductControllerBatch();
const imageController = new ImageController();

cronRoutes.post("/", productController.products);
cronRoutes.post("/batch", productControllerBatch.products);
cronRoutes.post("/images", imageController.images);

export { cronRoutes };
