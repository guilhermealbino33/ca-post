/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import api, { getAuthToken } from "services/LightSpeed/api";
import { IQueueInterface } from "services/Queue/interfaces/interfaces";

import { GetItemsByManufacturerSkuService } from "../services/getItemsByManufacturerSkuService";

class UpdateItemController {
  handle = async (req: Request, res: Response) => {
    const getItemsByManufacturerSkuService =
      new GetItemsByManufacturerSkuService();
    const token = await getAuthToken();
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    const queue = /* await queueAdvisorService.pullImageQueue(30); */

    queue.forEach(async (item: IQueueInterface, i: number) => {
      return null;
    });

    try {
      const apiReturn = await api.get(
        `/API/V3/Account/${process.env.ACCOUNT_ID}/Item.json`,
        {
          headers,
        }
      );
      return res.json(apiReturn.data);
    } catch (e: any) {
      return console.log("Error", e);
    }
  };
}
export { UpdateItemController };
