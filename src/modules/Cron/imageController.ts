/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import api, { createToken } from "services/api";

import { IBatchBody } from "./interfaces/Interfaces";
import { IQueueAdvisorUpdate } from "./models/QueueAdvisorUpdate";
import queueAdvisorService from "./Services/queueAdvisorService";

class ImageController {
  images = async (req: Request, res: Response) => {
    const headers = {
      "Content-Type": "application/json",
    };

    let count = 0;
    function increment() {
      // eslint-disable-next-line no-plusplus
      return count++;
    }

    const queue = await queueAdvisorService.pullQueue(100);
    await createToken();

    const batchBody: IBatchBody[] = [];
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
        product.data.images.map(async (image: string, i: number) => {
          console.log(`code ${code.body.value[0].ID}, image: ${image}`);

          const config = {
            id: String(increment()),
            method: "PUT",
            url: `/v1/Products(${code.body.value[0].ID})/Images(ITEMIMAGEURL${
              1 + i
            })`,
            body: {
              Url: `https://images.qbp.com/imageservice/image/1d59103516e0/prodxl/${image}`,
            },
          };
          batchBody.push(config);
        });
      }
    });
    try {
      console.log("external body", { requests: batchBody });
      // await api.post("/v1/$batch", JSON.stringify(config), { headers });
    } catch (e) {
      console.log(e);
    }
    res.status(201).json("Job concluded!");
  };
}

export { ImageController };
