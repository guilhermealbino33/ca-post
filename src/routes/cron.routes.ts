import { Router } from "express";
import { CreateChildProductService } from "modules/Cron/Services/createChildProductService ";
import { CreateParentProductService } from "modules/Cron/Services/createParentProductService";
import { ImageController } from "modules/Cron/useCases/imageController";
import { ProductController } from "modules/Cron/useCases/productController";

const cronRoutes = Router();
const createParentProductService = new CreateParentProductService();
const createChildProductService = new CreateChildProductService();
const productController = new ProductController();
const imageController = new ImageController();

cronRoutes.post("/products/child", createChildProductService.handle);
cronRoutes.post("/products", createParentProductService.handle);
cronRoutes.post("/attributes", productController.handle);
cronRoutes.post("/images", imageController.handle);

export { cronRoutes };
