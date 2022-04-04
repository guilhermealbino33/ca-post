/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import api, { createToken } from "services/api";

import { IBatchBody } from "../interfaces/Interfaces";
import { IQueueAdvisorUpdate } from "../models/QueueAdvisorUpdate";
import { CategoryService } from "../Services/categoryServiceCopy";
import { GetProductsBySkuService } from "../Services/getProductsBySkuService";
import queueAdvisorService from "../Services/queueAdvisorService";

class CategoryController {
  handle = async (req: Request, res: Response) => {
    const categoryService = new CategoryService();
    await createToken();
    const getProductsBySkuService = new GetProductsBySkuService();

    const headers = {
      "Content-Type": "application/json",
    };
    const batchBody: IBatchBody[] = [];

    const queue = await queueAdvisorService.pullQueue(60);

    const sku = queue.map(
      (item) => item.product?.data.manufacturerPartNumber ?? item.product?.code
    );

    const codes = await getProductsBySkuService.handle(sku);

    queue.forEach(async (item: IQueueAdvisorUpdate, i: number) => {
      const { product } = item;
      const productID = codes.data?.responses[i]?.body.value[0]?.ID;

      if (!productID || !product) {
        console.log(`*************** Sku ${sku} not found ***************`);
        return;
      }
      const data = categoryService.handle(product);
    });
    try {
      // await api.post(
      //   `/v1/$batch`,
      //   JSON.stringify({
      //     requests: batchBody,
      //   }),
      //   {
      //     headers,
      //   }
      // );
      return res.json("Concluded");
    } catch (e: any) {
      return console.log("Error", e);
    }
  };
}
export { CategoryController };
