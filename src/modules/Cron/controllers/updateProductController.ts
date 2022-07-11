/* eslint-disable consistent-return */
/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import api, { createToken } from "services/ChannelAdvisor/api";
import queueService from "services/Queue";
import { IQueueInterface } from "services/Queue/interfaces/interfaces";
import { utils } from "utils/utils";

import { IBatchBody } from "../interfaces/Interfaces";
import { GetProductsBySkuService } from "../services/getProductsBySkuService";

class UpdateProductController {
  handle = async (req: Request, res: Response) => {
    const { toHtml } = utils;
    await createToken();

    const headers = {
      "Content-Type": "application/json",
    };
    const batchBody: IBatchBody[] = [];
    const queue = await queueService.pullQueue(5);
    const getProductsBySkuService = new GetProductsBySkuService();

    const sku = queue.map(
      (item) => item.product?.data.manufacturerPartNumber ?? item.product?.code
    );
    let index = 0;
    for (const item of queue) {
      const { product } = item;
      const codes = await getProductsBySkuService.handle(sku);

      const productID = codes.data?.responses[index]?.body.value[0]?.ID;

      if (!productID) {
        console.log(`*************** Sku ${sku} not found ***************`);
        return;
      }
      // console.log("productSKU", productSKU);
      /** BATCH REQUEST MODEL TESTED ON POSTMAN */
      const config = {
        id: String(index),
        method: "put",
        url: `/v1/Products(${productID})`,
        body: {
          Description: product.data.model.description,
          ShortDescription: toHtml(product.data.model.bulletPoints),
        },
        headers: {
          "Content-Type": "application/json",
        },
      };
      console.log(`${index} - code ${productID}`);
      batchBody.push(config);
      // eslint-disable-next-line no-plusplus
      index++;
    }
    console.log("batchBody", batchBody);

    try {
      if (batchBody.length === 0) {
        res
          .status(201)
          .json("No products have been updated on Channel Advisor!");
      }

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
      return console.log("Error", e.response);
    }
  };
}
export { UpdateProductController };
