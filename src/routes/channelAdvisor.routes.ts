import { Router } from "express";
import { ChannelAdvisorController } from "modules/externalChannelAdvisor/externalChannelAdvisorController";

const channelRoutes = Router();
const channelAdvisorController = new ChannelAdvisorController();

channelRoutes.get("/products/list", channelAdvisorController.list);

channelRoutes.get("/products/single/:code", channelAdvisorController.single);

channelRoutes.post("/products/create/", channelAdvisorController.createProduct);

channelRoutes.post(
  "/products/update/:code",
  channelAdvisorController.updateProduct
);

channelRoutes.patch(
  "/products/images/:code/:images",
  channelAdvisorController.productImages
);

export { channelRoutes };
