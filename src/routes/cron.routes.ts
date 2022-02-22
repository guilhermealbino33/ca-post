import { Router } from "express";
import { AttributeController } from "modules/Cron/useCases/attributeController";
import { ImageController } from "modules/Cron/useCases/imageController";
import { ProductController } from "modules/Cron/useCases/productController";

const cronRoutes = Router();
const productController = new ProductController();
const attributeController = new AttributeController();
const imageController = new ImageController();

cronRoutes.post("/", productController.handle);
cronRoutes.post("/attributes", attributeController.handle);
cronRoutes.post("/images", imageController.handle);

export { cronRoutes };
