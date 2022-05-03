/**
 * Cron file
 * NOT REMOVE!
 */

import { Request, Response } from "express";

import { setup } from "./database/mongoDB";
import { CategoryController } from "./modules/Cron/controllers/categoryController";
import { ImageController } from "./modules/Cron/controllers/imageController";
import { LabelController } from "./modules/Cron/controllers/labelController";
import { ProductController } from "./modules/Cron/controllers/productController";

import "./infra/config-env";

const productController = new ProductController();
const imageController = new ImageController();
const labelController = new LabelController();
const categoryController = new CategoryController();

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
export const categories = async (req: Request, res: Response) => {
  await setup();
  return categoryController.handle(req, res);
};
