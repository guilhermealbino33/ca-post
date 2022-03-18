/**
 * Cron file
 * NOT REMOVE!
 */

import { Request, Response } from "express";

import { setup } from "./database/mongoDB";
import { ImageController } from "./modules/Cron/useCases/imageController";
import { LabelController } from "./modules/Cron/useCases/labelController";
import { ProductController } from "./modules/Cron/useCases/productController";

import "./infra/config-env";

const productController = new ProductController();
const imageController = new ImageController();
const labelController = new LabelController();

export const products = async (req: Request, res: Response) => {
  await setup();
  return productController.handle(req, res);
};

export const images = async (req: Request, res: Response) => {
  await setup();
  return imageController.handle(req, res);
};
export const labels = async (req: Request, res: Response) => {
  await setup();
  return labelController.handle(req, res);
};
