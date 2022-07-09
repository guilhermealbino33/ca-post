import { Router } from "express";
import { createCategoryHandle } from "modules/LightSpeed/useCases/categoryController";
import { GetItemsController } from "modules/LightSpeed/useCases/getItemsController";
import { updateItemsHandle } from "modules/LightSpeed/useCases/itemController";

const lightSpeedRoutes = Router();
const itemController = new GetItemsController();

lightSpeedRoutes.put("/categories", createCategoryHandle);
lightSpeedRoutes.get("/items", itemController.handle);
lightSpeedRoutes.put("/items/update", updateItemsHandle);

export { lightSpeedRoutes };
