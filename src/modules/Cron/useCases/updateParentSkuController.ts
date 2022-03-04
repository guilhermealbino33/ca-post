/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import api, { createToken } from "services/api";

class UpdateParentSkuController {
  handle = async (req: Request, res: Response) => {
    await createToken();

    const productID = ""; // Verificar para trazer da lista
    const productSKU = "";

    const headers = {
      "Content-Type": "application/json",
    };

    /** BATCH REQUEST MODEL TESTED ON POSTMAN */
    const batchBody = {
      id: "0",
      method: "put",
      url: `/v1/Products(${productID})`,
      body: {
        Sku: `PARENT-${productSKU}`,
      },
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      await api.post(
        `/v1/$batch`,
        JSON.stringify({
          requests: { batchBody },
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
export { UpdateParentSkuController };
