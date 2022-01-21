import { Router } from "express";

import { ProductController } from "../modules/QBP/useCases/productController";

const qbpRoutes = Router();
const productController = new ProductController();

qbpRoutes.get("/:code", productController.details);

export { qbpRoutes };
