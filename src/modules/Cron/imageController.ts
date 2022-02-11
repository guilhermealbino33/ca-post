/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import api, { createToken } from "services/api";

import { IQueueAdvisorUpdate } from "./models/QueueAdvisorUpdate";
import queueAdvisorService from "./Services/queueAdvisorService";

class ImageController {
  images = async (req: Request, res: Response) => {
    const headers = {
      "Content-Type": "multipart/mixed; boundary=changeset",
    };

    const queue = await queueAdvisorService.pullOne();
    let config: any;
    await createToken();

    const bodyCodes = {
      requests: queue.map((item: IQueueAdvisorUpdate, index) => ({
        id: String(index),
        method: "get",
        url: `/v1/products?$filter=Sku eq '${item.product.data.manufacturerPartNumber}'&$select=ID, Sku`,
      })),
    };

    const codes = await api.post(`/v1/$batch`, JSON.stringify(bodyCodes), {
      headers: {
        "Content-Type": "application/json",
      },
    });

    queue.forEach(async (item: IQueueAdvisorUpdate, index: number) => {
      const { product } = item;

      if (!product || !product.data) {
        console.log(`Product ${product.code} not exists`);
        return;
      }

      try {
        const code = codes.data.responses.find(
          (code: any) =>
            code.body.value[0].Sku === product.data.manufacturerPartNumber
        );

        if (product.data.images.length > 0) {
          product.data.images.forEach(async (image: string, i: number) => {
            console.log(`code ${code.body.value[0].ID}, image: ${image}`);

            config = {
              requests: [
                {
                  id: index,
                  method: "patch",
                  url: `/v1/Products(${
                    code.body.value[0].ID
                  })/Images(ITEMIMAGEURL${1 + i})`,
                  body: {
                    Url: `https://images.qbp.com/imageservice/image/1d59103516e0/prodxl/${image}`,
                  },
                  headers: {
                    "Content-Type": "application/json",
                    "Retry-After": 3600,
                  },
                },
              ],
            };
          });
        }
        console.log("body", config.requests.body);
      } catch (error) {
        res.status(400).json(error);
      }
    });

    try {
      await api.post("/v1/$batch", config, { headers });
    } catch (e) {
      console.log(e);
    }
    res.status(201).json("Job concluded!");
  };
}

export { ImageController };
