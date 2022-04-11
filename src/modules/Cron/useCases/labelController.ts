/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import api, { createToken } from "../../../services/ChannelAdvisor/api";

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

    const queue = await queueAdvisorService.pullLabelQueue(50);
    await createToken();

    let batchBody: IBatchBody[] = [];
    const batchPopulate: any[] = [];
    const codesResponse: string[] = ["Job concluded!"];

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
      // console.log("codes", codes.data.responses[i].body);

      if (codes.data.responses[i].body.value?.length === 0) {
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
      // console.log("code outside", code);
      if (!code) {
        console.log("Undefined code.");
        return;
      }
      const productId = code?.body.value?.[0].ID;
      const ThirdPartyAllowed = product.data.thirdPartyAllowed;
      console.log(`${i + 1} - ID ${productId}`);

      const config = thirdPartyAllowedService.handle({
        childProductId: productId,
        ThirdPartyAllowed,
      });
      batchPopulate.push(config);
    });
    batchBody = batchPopulate.reduce((previous, current) => [
      ...previous,
      ...current,
    ]);
    // console.log("batchPopulate", batchBody);

    try {
      if (batchBody.length === 0) {
        res.status(201).json("Products doesn't exists on Channel Advisor");
        return;
      }
      await api.post(`/v1/$batch`, JSON.stringify({ requests: batchBody }), {
        headers,
      });
    } catch (e: any) {
      // eslint-disable-next-line consistent-return
      return console.log("Error", e.response);
    }
    res.status(201).json(codesResponse);
  };
}
export { LabelController };
