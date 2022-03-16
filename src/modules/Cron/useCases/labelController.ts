/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import api, { createToken } from "services/api";

import { IBatchBody } from "../interfaces/Interfaces";
import { IQueueAdvisorUpdate } from "../models/QueueAdvisorUpdate";
import queueAdvisorService from "../Services/queueAdvisorService";
import { ThirdPartyAllowedService } from "../Services/thirdPartyAllowedService";

const thirdPartyAllowedService = new ThirdPartyAllowedService();

class LabelController {
  handle = async (req: Request, res: Response) => {
    const headers = {
      "Content-Type": "application/json",
    };

    const queue = await queueAdvisorService.pullQueue(30);
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
          code?.body.value?.[0]?.Sku === product.data.manufacturerPartNumber ||
          code?.body.value?.[0]?.Sku === product.data.code ||
          code?.body.value?.[0]?.Sku === `PARENT-${product.data.model.code}`
      );
      if (code) {
        console.log("code", code?.value?.[0]);
      }
      // thirdPartyAllowedService.handle({
      //   childProductId,
      //   ThirdPartyAllowed,
      // });
    });

    try {
      // console.log("external body", { requests: batchBody });
      if (batchBody.length === 0) {
        res.status(201).json("Products doesn't exists on Channel Advisor");
        return;
      }
      // await api.post(`/v1/$batch`, JSON.stringify({ requests: batchBody }), {
      //   headers,
      // });
    } catch (e: any) {
      // eslint-disable-next-line consistent-return
      return console.log("Error", e.response.data);
    }
    res.status(201).json(codesResponse);
  };
}
export { LabelController };
