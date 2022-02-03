import { Request, Response } from "express";
import api, { createToken } from "services/api";

import { IQueueAdvisorUpdate } from "./models/QueueAdvisorUpdate";
import queueAdvisorService from "./Services/queueAdvisorService";

class ImageController {
  images = async (req: Request, res: Response) => {
    const codes = await queueAdvisorService.pullQueue();

    async function call(code: string, image: string, body: object) {
      const response = await api.patch(
        `/v1/Products(${code})/Images('${image}')`,
        body
      );
      return response;
    }

    await createToken();

    const queue = codes.map(async (item: IQueueAdvisorUpdate) => {
      const { product } = item;

      if (!product || !product.data) {
        console.log(`Product ${product.code} not exists`);
        return;
      }

      try {
        const resCode = await api.get(
          `/v1/products?$filter=Sku eq '${product.data.manufacturerPartNumber}'&$select=ID`
        );
        const code = resCode.data.value[0].ID;
        console.log(`code ${resCode.data.value[0].ID}`);

        if (product.data.images.length > 0) {
          const queueImages = product.data.images.map(async (image: string) => {
            console.log(`code ${code}, image: ${image}`);

            const body = {
              Url: `https://images.qbp.com/imageservice/image/1d59103516e0/prodxl/${image}`,
            };
            await call(code, image, body);
          });
          await Promise.all(queueImages);
        }
      } catch (error) {
        res.status(400).json(error);
      }
    });

    try {
      await Promise.all(queue);
    } catch (e) {
      console.log(e);
    }
    res.status(201).json("Job concluded!");
  };
}

export { ImageController };
