import { Router } from "express";
import { createCategoryHandle } from "modules/LightSpeed/useCases/categoryController";
import { GetItemsController } from "modules/LightSpeed/useCases/getItemsController";
import { UpdateItemController } from "modules/LightSpeed/useCases/updateItemController";

const lightSpeedRoutes = Router();
const itemController = new GetItemsController();
const updateItemController = new UpdateItemController();

lightSpeedRoutes.post("/categories", createCategoryHandle);
lightSpeedRoutes.get("/items", itemController.handle);
lightSpeedRoutes.post("/items/update", updateItemController.handle);

export { lightSpeedRoutes };
