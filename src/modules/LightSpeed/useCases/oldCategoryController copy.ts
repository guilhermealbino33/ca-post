/* eslint-disable @typescript-eslint/no-explicit-any */

import { Request, Response } from "express";
import api, { getAuthToken } from "services/LightSpeed/api";
import queueAdvisorService from "services/Queue";
import { IQueueInterface } from "services/Queue/interfaces/interfaces";

import { CategoryService } from "../services/categoryService";

class CategoryController {
  handle = async (req: Request, res: Response) => {
    const token = await getAuthToken();
    const categoryService = new CategoryService();
    const queue = await queueAdvisorService.pullCategoryQueue(1);
    const data: any = [];
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    queue.forEach(async (item: IQueueInterface) => {
      const { product } = item;

      if (!product) {
        console.log(`*************** Sku not found ***************`);
        return;
      }
      data.push(categoryService.handle(product));
    });
    try {
      await api.post(
        `/API/V3/Account/${process.env.ACCOUNT_ID}/Category.json`,
        data,
        {
          headers,
        }
      );
      return res.json("Concluded");
    } catch (e: any) {
      return console.log("Error", e);
    }
  };
}
export { CategoryController };
