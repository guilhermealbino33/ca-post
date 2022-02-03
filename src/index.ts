/**
 * Google Cron file
 * NOT REMOVE!
 */

import { Request, Response } from "express";

import { setup } from "./database/mongoDB";
import { ProductController } from "./modules/GoogleCron/productController";

import "./infra/config-env";

const productController = new ProductController();

export const products = async (req: Request, res: Response) => {
  await setup();
  return productController.products(req, res);
};
