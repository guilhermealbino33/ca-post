import { Request, Response } from "express";
import api, { createToken } from "services/api";
import { utils } from "utils/utils";

import { IQueueAdvisorUpdate } from "./models/QueueAdvisorUpdate";
import queueAdvisorService from "./Services/queueAdvisorService";

class ProductControllerBatch {
  products = async (req: Request, res: Response) => {
    const headers = {
      "Content-Type": "multipart/mixed; boundary=changeset",
    };

    const queue = await queueAdvisorService.pullQueue(100);
    let body;

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

    queue.forEach(async (item: IQueueAdvisorUpdate, i: number) => {
      const { product } = item;

      if (!product || !product.data) {
        console.log(`Product ${product.code} not exists`);
        return;
      }

      const data = {
        Value: {
          Attributes: [
            {
              Name: "QBP Code",
              Value: product.data.code,
            },
            {
              Name: "QBP Name",
              Value: utils.prettyName(
                product.data.name,
                product.data.model.name,
                product.data.brand.name
              ),
            },
            {
              Name: "QBP Model",
              Value: `${product.data.brand.name} ${product.data.model.name}`,
            },
            {
              Name: "QBP Description",
              Value: product.data.model.description,
            },
            {
              Name: "QBP Short Description",
              Value: utils.toHtml(product.data.model.bulletPoints),
            },
            {
              Name: "QBP Cost",
              Value: JSON.stringify(product.data.basePrice),
            },
            {
              Name: "QBP MAP",
              Value: JSON.stringify(product.data.mapPrice),
            },
            {
              Name: "QBP MSRP",
              Value: JSON.stringify(product.data.msrp),
            },
            {
              Name: "QBP Brand",
              Value: product.data.brand.name,
            },
            {
              Name: "QBP Discontinued",
              Value: JSON.stringify(product.data.discontinued),
            },
            {
              Name: "QBP Thirdpartyallowed",
              Value: JSON.stringify(product.data.thirdPartyAllowed),
            },
          ],
        },
      };

      type IAttribQBP = {
        name: string;
        value: string;
      };

      product.data.productAttributes.forEach(
        (attrib: IAttribQBP, i: number) => {
          const attribute = {
            Name: `Metafield${1 + i}`,
            Value: `• ${attrib.name}: ${attrib.value}`,
          };
          data.Value.Attributes.push(attribute);
        }
      );
      try {
        const code = codes.data.responses.find(
          (code: any) =>
            code.body.value[0].Sku === product.data.manufacturerPartNumber
        );

        console.log(`code ${code.body.value[0].ID}`);

        body = {
          requests: [
            {
              id: i,
              method: "post",
              url: `/v1/Products(${code.body.value[0].ID})/UpdateAttributes`,
              headers: {
                "Retry-After": 3600,
              },
              body: data,
            },
          ],
        };
        // await api.post(`/v1/Products(${code})/UpdateAttributes`, data);
      } catch (error) {
        console.log("error", error);
      }
    });

    try {
      // await Promise.all(queue);
      await api.post(`/v1/$batch`, body, { headers });
    } catch (e) {
      console.log(e);
    }
    res.status(201).json("Job concluded!");
  };
}

export { ProductControllerBatch };