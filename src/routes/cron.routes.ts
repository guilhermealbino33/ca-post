import { Router } from "express";
import { ImageController } from "modules/Cron/useCases/imageController";
import { LabelController } from "modules/Cron/useCases/labelController";
import { ProductCategoryController } from "modules/Cron/useCases/productCategoryController";
import { ProductController } from "modules/Cron/useCases/productController";
import { UpdateProductController } from "modules/Cron/useCases/updateProductController";

const cronRoutes = Router();
const productController = new ProductController();
const imageController = new ImageController();
const updateProductController = new UpdateProductController();
const labelController = new LabelController();
const categoriesController = new ProductCategoryController();

cronRoutes.post("/products/update", updateProductController.handle);
cronRoutes.post("/categories", categoriesController.handle);
cronRoutes.post("/attributes", productController.handle);
cronRoutes.post("/images", imageController.handle);
cronRoutes.post("/labels", labelController.handle);

export { cronRoutes };
