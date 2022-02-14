/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import api, { createToken } from "services/api";

import { IQueueAdvisorUpdate } from "./models/QueueAdvisorUpdate";
import queueAdvisorService from "./Services/queueAdvisorService";

const config = {};

class ImageController {
  images = async (req: Request, res: Response) => {
    const headers = {
      "Content-Type": "application/json",
    };

    const queue = await queueAdvisorService.pullOne();
    await createToken();

    const bodyCodes = {
      requests: queue.map((item: IQueueAdvisorUpdate, index: number) => ({
        id: String(index),
        method: "get",
        url: `/v1/products?$filter=Sku eq '${item.product.data.manufacturerPartNumber}'&$select=ID, Sku`,
      })),
    };

    const codes = await api.post(`/v1/$batch`, JSON.stringify(bodyCodes), {
      headers,
    });

    queue.forEach(async (item: IQueueAdvisorUpdate) => {
      const { product } = item;

      if (!product || !product.data) {
        console.log(`Product ${product.code} not exists`);
        return;
      }

      const code = codes.data.responses.find(
        (code: any) =>
          code.body.value[0].Sku === product.data.manufacturerPartNumber
      );

      if (product.data.images.length > 0) {
        type IBatch = {
          requests: [id: string, method: string, url: string, body: object];
        };
        let config: IBatch;

        product.data.images.map(async (image: string, i: number) => {
          console.log(`code ${code.body.value[0].ID}, image: ${image}`);

          const test = {
            id: String(i),
            method: "PUT",
            url: `/v1/Products(${code.body.value[0].ID})/Images(ITEMIMAGEURL${
              1 + i
            })`,
            body: {
              Url: `https://images.qbp.com/imageservice/image/1d59103516e0/prodxl/${image}`,
            },
          };
          config.requests.push(test);
        });
        try {
          console.log("external body", config);
          await api.post("/v1/$batch", JSON.stringify(config), { headers });
        } catch (e) {
          console.log(e);
        }
      }
    });
    res.status(201).json("Job concluded!");
  };
}

export { ImageController };
