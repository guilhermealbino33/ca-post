import { Router } from "express";
import { AttributeController } from "modules/ChannelAdvisor/useCases/AttributeController";
import { ProductController } from "modules/ChannelAdvisor/useCases/ProductController";

const channelRoutes = Router();

const attributeController = new AttributeController();
const productController = new ProductController();
channelRoutes.post("/attribute", attributeController.createAttribute);
channelRoutes.post("/product", productController.createProduct);

export { channelRoutes };
