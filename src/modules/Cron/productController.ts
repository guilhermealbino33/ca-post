import { Request, Response } from "express";
import api, { createToken } from "services/api";
import { utils } from "utils/utils";

import { IBatchBody } from "./interfaces/Interfaces";
import { IQueueAdvisorUpdate } from "./models/QueueAdvisorUpdate";
import queueAdvisorService from "./Services/queueAdvisorService";

class ProductController {
  products = async (req: Request, res: Response) => {
    const queue = await queueAdvisorService.pullQueue(100);
    const headers = {
      "Content-Type": "application/json",
    };
    const batchBody: IBatchBody[] = [];

    await createToken();

    const bodyCodes = {
      requests: queue.map((item: IQueueAdvisorUpdate, index) => ({
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

      if (!product || !product.data || !product.data.manufacturerPartNumber) {
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

      const code = codes.data.responses.find(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (code: any) =>
          code.body.value[0].Sku === product.data.manufacturerPartNumber
      );
      if (code.body.value[0].Sku === undefined) {
        console.log(`Product ${code.body.value[0].ID} has undefined SKU!`);
        return;
      }

      console.log(`code ${code.body.value[0].ID}`);

      const config = {
        id: String(i),
        method: "post",
        url: `/v1/Products(${code.body.value[0].ID})/UpdateAttributes`,
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      };
      batchBody.push(config);
    });
    try {
      // console.log("body ", { requests: batchBody });

      await api.post(`/v1/$batch`, JSON.stringify({ requests: batchBody }), {
        headers,
      });
    } catch (e) {
      console.log(e);
    }
    res.status(201).json("Job concluded!");
  };
}

export { ProductController };
