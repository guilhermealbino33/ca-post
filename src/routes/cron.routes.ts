import { Router } from "express";
import { CreateProductController } from "modules/Cron/useCases/createProductController";
import { ImageController } from "modules/Cron/useCases/imageController";
import { ProductController } from "modules/Cron/useCases/productController";
import { UpdateProductController } from "modules/Cron/useCases/updateProductController";

const cronRoutes = Router();
const productController = new ProductController();
const imageController = new ImageController();
const updateProductController = new UpdateProductController();
const createProductController = new CreateProductController();

cronRoutes.post("/products/create", createProductController.handle);
cronRoutes.post("/products/update", updateProductController.handle);
cronRoutes.post("/attributes", productController.handle);
cronRoutes.post("/images", imageController.handle);

export { cronRoutes };
