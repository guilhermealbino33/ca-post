import { Router } from "express";

import { CategoryController } from "../modules/Cron/controllers/categoryController";
import { ImageController } from "../modules/Cron/controllers/imageController";
import { LabelController } from "../modules/Cron/controllers/labelController";
import { ProductController } from "../modules/Cron/controllers/productController";
import { UpdateProductController } from "../modules/Cron/controllers/updateProductController";

const cronRoutes = Router();
const productController = new ProductController();
const imageController = new ImageController();
const updateProductController = new UpdateProductController();
const labelController = new LabelController();
const categoriesController = new CategoryController();

cronRoutes.post("/products/update", updateProductController.handle);
cronRoutes.post("/categories", categoriesController.handle);
cronRoutes.post("/attributes", productController.handle);
cronRoutes.post("/images", imageController.handle);
cronRoutes.post("/labels", labelController.handle);

export { cronRoutes };
