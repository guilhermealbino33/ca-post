import { Router } from "express";

import { CategoryController } from "../modules/Cron/useCases/categoryController";
import { ImageController } from "../modules/Cron/useCases/imageController";
import { LabelController } from "../modules/Cron/useCases/labelController";
import { UpdateProductController } from "../modules/Cron/useCases/updateProductController";

const cronRoutes = Router();
const productController = new UpdateProductController();
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
