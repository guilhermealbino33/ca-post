/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import api, { createToken } from "services/api";

import { IBatchBody } from "../interfaces/Interfaces";

class UpdateProductController {
  handle = async (req: Request, res: Response) => {
    await createToken();

    const headers = {
      "Content-Type": "application/json",
    };
    const batchBody: IBatchBody[] = [];
    const queue = req.body.Sku;
    // const newSku = req.body.NewSku;

    const bodyCodes = {
      requests: queue.map((sku: string, index: number) => ({
        id: String(index),
        method: "get",
        url: `/v1/products?$filter=Sku eq '${sku}'&$select=ID, Sku`,
      })),
    };
    const codes = await api.post(`/v1/$batch`, JSON.stringify(bodyCodes), {
      headers,
    });

    queue.forEach(async (sku: string, index: number) => {
      const productID = codes.data?.responses[index]?.body.value[0].ID;

      // if (!productID) {
      //   console.log("Sku not found");
      //   return;
      // }

      /** BATCH REQUEST MODEL TESTED ON POSTMAN */
      const config = {
        id: String(index),
        method: "put",
        url: `/v1/Products(${productID})`,
        body: {
          Sku: `PARENT-${sku}`,
        },
        headers: {
          "Content-Type": "application/json",
        },
      };
      console.log(`code ${productID}`);
      batchBody.push(config);
    });
    // console.log(batchBody);
    try {
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
      return console.log("Error", e.response.data);
    }
  };
}
export { UpdateProductController };
