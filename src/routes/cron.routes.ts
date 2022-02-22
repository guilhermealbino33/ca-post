import { Router } from "express";
import { CreateChildProductService } from "modules/Cron/Services/createChildProductService ";
import { CreateParentProductService } from "modules/Cron/Services/createParentProductService";
import { AttributeController } from "modules/Cron/useCases/attributeController";
import { ImageController } from "modules/Cron/useCases/imageController";

const cronRoutes = Router();
const createParentProductService = new CreateParentProductService();
const createChildProductService = new CreateChildProductService();
const attributeController = new AttributeController();
const imageController = new ImageController();

cronRoutes.post("/products/child", createChildProductService.handle);
cronRoutes.post("/products", createParentProductService.handle);
cronRoutes.post("/attributes", attributeController.handle);
cronRoutes.post("/images", imageController.handle);

export { cronRoutes };
