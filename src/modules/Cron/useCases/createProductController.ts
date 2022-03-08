/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import api, { createToken } from "services/api";
import { utils } from "utils/utils";

import { IBatchBody } from "../interfaces/Interfaces";
import { IQueueAdvisorUpdate } from "../models/QueueAdvisorUpdate";
import { CreateChildProductService } from "../Services/createChildProductService ";
import queueAdvisorService from "../Services/queueAdvisorService";

class CreateProductController {
  handle = async (req: Request, res: Response) => {
    const headers = {
      "Content-Type": "application/json",
    };
    const { toHtml } = utils;

    let count = 0;
    function incrementIndex() {
      // eslint-disable-next-line no-plusplus
      return count++;
    }

    const queue = await queueAdvisorService.pullCreateQueue(10);
    await createToken();

    const batchBody: IBatchBody[] = [];

    const bodyCodes = {
      requests: queue.map((item: IQueueAdvisorUpdate, index: number) => ({
        id: String(index),
        method: "get",
        url: `/v1/products?$filter=Sku eq '${item.product?.data.manufacturerPartNumber}'&$select=ID, Sku`,
      })),
    };

    const codes = await api.post(`/v1/$batch`, JSON.stringify(bodyCodes), {
      headers,
    });

    queue.forEach(async (item: IQueueAdvisorUpdate, i: number) => {
      const { product } = item;

      if (!product || !product.data) {
        console.log(`Product doesn't exists`);
        return;
      }

      console.log("product code", product.data?.code);

      const code = codes.data.responses.find(
        (code: any) =>
          code?.body.value[0]?.Sku === product.data.manufacturerPartNumber ||
          code?.body.value[0]?.Sku === product.data.code ||
          code?.body.value[0]?.Sku === `PARENT-${product.data.model.code}`
      );

      if (code?.body.value.length === 0 || !code) {
        const currentBody = {
          requests: queue.map((item: IQueueAdvisorUpdate, index: number) => ({
            id: String(index),
            method: "get",
            url: `/v1/products?$filter=Sku eq '${product.data.model.code}'&$select=ID, Sku`,
          })),
        };

        const currentProduct = await api.post(
          `/v1/$batch`,
          JSON.stringify(currentBody),
          {
            headers,
          }
        );
        const currentSku = currentProduct.data.responses[0].body.Sku;
        const currentID = currentProduct.data.responses[0]?.ID;

        console.log(
          "*********** currentBody",
          currentProduct.data.responses[0]
        );
        console.log("*********** currentSku", currentSku);
        console.log(
          "*********** Model code",
          `PARENT-${product.data.model.code}`
        );
        if (currentSku !== `PARENT-${product.data.model.code}`) {
          const body = {
            Sku: `PARENT-${product.data.model.code}`,
            IsParent: true,
            IsInRelationship: true,
            Brand: product.data.brand.name,
            Title: `${product.data.brand.name} ${product.data.model.name}`,
            Description: product.data.model.description,
            ShortDescription: toHtml(product.data.model.bulletPoints),
            VaryBy: "Choose Option",
          };
          const config = {
            id: String(i),
            method: "post",
            url: `/v1/Products`,
            body,
            headers: {
              "Content-Type": "application/json",
            },
          };
          batchBody.push(config);
        }
      }
    });
    try {
      console.log("external body", batchBody);
      if (batchBody.length === 0) {
        res.status(201).json("Empty body");
      } else {
        await api.post(`/v1/$batch`, JSON.stringify({ requests: batchBody }), {
          headers,
        });
        console.log(`parent product created`);
      }
    } catch (e: any) {
      console.log(e.response.data);
    }
    res.status(201).json("Concluded");
  };
}

export { CreateProductController };
