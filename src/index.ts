/**
 * Cron file
 * NOT REMOVE!
 */

import { Request, Response } from "express";

import { setup } from "./database/mongoDB";
import { AttributeController } from "./modules/Cron/attributeController";
import { ImageController } from "./modules/Cron/imageController";

import "./infra/config-env";

const attributeController = new AttributeController();
const imageController = new ImageController();

export const productsAttributes = async (req: Request, res: Response) => {
  await setup();
  return attributeController.attributes(req, res);
};

export const images = async (req: Request, res: Response) => {
  await setup();
  return imageController.images(req, res);
};
