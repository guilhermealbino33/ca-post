import { Router } from "express";
import { ExternalChannelAdvisorController } from "modules/externalChannelAdvisor/ExternalChannelAdvisorController";

const externalChannelRoutes = Router();
const externalChannelAdvisorController = new ExternalChannelAdvisorController();

externalChannelRoutes.get(
  "/products/list",
  externalChannelAdvisorController.list
);
externalChannelRoutes.get(
  "/products/single/:code",
  externalChannelAdvisorController.single
);
externalChannelRoutes.post(
  "/products/create/",
  externalChannelAdvisorController.createProduct
);
externalChannelRoutes.post(
  "/products/update/:code",
  externalChannelAdvisorController.updateProduct
);

export { externalChannelRoutes };
