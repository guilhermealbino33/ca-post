/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Request, Response } from "express";
import { IBatchBody } from "modules/Cron/interfaces/Interfaces";
import { IQueueAdvisorUpdate } from "modules/Cron/models/QueueAdvisorUpdate";
import { v4 as uuidV4 } from "uuid";
import { CategoryService } from "../services/categoryService";

class CategoryController {
  handle = async (req: Request, res: Response) => {
    const categoryService = new CategoryService();
    await createToken();
    const getProductsBySkuService = new GetProductsBySkuService();

    const headers = {
      "Content-Type": "application/json",
    };
    const batchBody: IBatchBody[] = [];

    const queue = await queueAdvisorService.pullCategoryQueue(100);

    const sku = queue.map(
      (item) => item.product?.data.manufacturerPartNumber ?? item.product?.code
    );

    const codes = await getProductsBySkuService.handle(sku);

    queue.forEach(async (item: IQueueAdvisorUpdate, i: number) => {
      const { product } = item;
      const productID = codes.data?.responses[i]?.body.value[0]?.ID;

      if (!productID || !product) {
        console.log(`*************** Sku not found ***************`);
        return;
      }
      const data = categoryService.handle(product);
      console.log(productID);

      const config = {
        id: String(uuidV4()),
        method: "post",
        url: `/API/Account/{accountID}/Category.json`,
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      };
      batchBody.push(config);
    });
    try {
      await api.post(
        `/v1/$batch`,
        JSON.stringify({
          requests: batchBody,
        }),
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
