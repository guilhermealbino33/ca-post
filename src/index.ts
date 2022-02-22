/**
 * Cron file
 * NOT REMOVE!
 */

import { Request, Response } from "express";

import { setup } from "./database/mongoDB";
import { AttributeController } from "./modules/Cron/useCases/attributeController";
import { ImageController } from "./modules/Cron/useCases/imageController";
import { ProductController } from "./modules/Cron/useCases/productController";

import "./infra/config-env";

const attributeController = new AttributeController();
const imageController = new ImageController();
const productController = new ProductController();

export const products = async (req: Request, res: Response) => {
  await setup();
  return productController.handle(req, res);
};

export const productsAttributes = async (req: Request, res: Response) => {
  await setup();
  return attributeController.handle(req, res);
};

export const images = async (req: Request, res: Response) => {
  await setup();
  return imageController.handle(req, res);
};
