/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import api, { getAuthToken } from "services/LightSpeed/api";

class GetItemsController {
  handle = async (req: Request, res: Response) => {
    const token = await getAuthToken();
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

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
export { GetItemsController };
