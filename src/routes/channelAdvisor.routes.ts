import { Router } from "express";
import { ChannelAdvisorController } from "modules/ChannelAdvisor/channelAdvisorController";

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
