/**
 * Google Cron file
 * NOT REMOVE!
 */

import { Request, Response } from "express";

import { setup } from "./database/mongoDB";
import { ImageController } from "./modules/GoogleCron/imageController";
import { ProductController } from "./modules/GoogleCron/productController";

import "./infra/config-env";

const productController = new ProductController();
const imageController = new ImageController();

export const products = async (req: Request, res: Response) => {
  await setup();
  return productController.products(req, res);
};

export const images = async (req: Request, res: Response) => {
  await setup();
  return imageController.images(req, res);
};
