import { Router } from "express";

import { ProductController } from "../modules/QBP/useCases/productController";

const qbpRoutes = Router();
const productController = new ProductController();

qbpRoutes.get("/:code", productController.details);
/*
router.get('/export/tocsv', productController.exportToCsv);
*/
qbpRoutes
  .route("/translate/product")
  .get(productController.listProducts)
  .post(productController.translateDetails);

export { qbpRoutes };
