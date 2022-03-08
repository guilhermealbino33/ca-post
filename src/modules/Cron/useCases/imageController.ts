/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import api, { createToken } from "services/api";

import { IBatchBody } from "../interfaces/Interfaces";
import { IQueueAdvisorUpdate } from "../models/QueueAdvisorUpdate";
import queueAdvisorService from "../Services/queueAdvisorService";

class ImageController {
  handle = async (req: Request, res: Response) => {
    const headers = {
      "Content-Type": "application/json",
    };

    let count = 0;
    function incrementIndex() {
      // eslint-disable-next-line no-plusplus
      return count++;
    }

    const queue = await queueAdvisorService.pullImageQueue(30);
    await createToken();

    const batchBody: IBatchBody[] = [];
    const codesResponse: string[] = ["Job concluded!"];

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

    queue.forEach(async (item: IQueueAdvisorUpdate, i: number) => {
      const { product } = item;

      if (codes.data.responses[i].body.value.length === 0) {
        console.log(`Product ${product.code} do not exists on Channel Advisor`);
        return;
      }

      if (!product || !product.data) {
        console.log(`Product ${product.code} don't exists`);
        return;
      }

      const code = codes.data.responses.find(
        (code: any) =>
          code?.body.value[0]?.Sku === product.data.manufacturerPartNumber
      );

      if (product.data.images.length > 0) {
        product.data.images.map(async (image: string, i: number) => {
          if (!code) {
            console.log(
              `Product ${product.code} has null manufacturer part number!`
            );
            return;
          }
          codesResponse.push(`code ${code.body.value[0].ID}, image: ${image}`);
          console.log(`code ${code.body.value[0].ID}, image: ${image}`);

          const placementName = `'ITEMIMAGEURL${1 + i}'`;
          const config = {
            id: String(incrementIndex()),
            method: "patch",
            url: `/v1/Images(ProductID=${code.body.value[0].ID}, PlacementName=${placementName})`,
            body: {
              Url: `https://images.qbp.com/imageservice/image/1d59103516e0/prodxl/${image}`,
            },
            headers: {
              "Content-Type": "application/json",
            },
          };
          batchBody.push(config);
        });
      }
    });
    try {
      // console.log("external body", { requests: batchBody });
      if (batchBody.length === 0) {
        res.status(201).json("Products doesn't exists on Channel Advisor");
        return;
      }

      await api.post(`/v1/$batch`, JSON.stringify({ requests: batchBody }), {
        headers,
      });
    } catch (e) {
      console.log(e);
    }
    res.status(201).json(codesResponse);
  };
}

export { ImageController };
