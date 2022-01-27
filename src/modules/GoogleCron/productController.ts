import { Request, Response } from "express";
import { ProductRepository } from "modules/QBP/repositories/productRepository";
import api from "services/api";
import { utils } from "utils/utils";

import { IQueueAdvisorUpdate } from "./models/QueueAdvisorUpdate";
import queueAdvisorService from "./Services/queueAdvisorService";

class ProductController {
  products = async (req: Request, res: Response) => {
    const codes = await queueAdvisorService.pullQueue();

    const queue = codes.map(async (item: IQueueAdvisorUpdate) => {
      const { code } = item;
      const product = await ProductRepository.findOne({ code });

      if (!product) {
        console.log(`Product ${code} not exists`);
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
        const response = await api.post(
          `/v1/Products(${code})/UpdateAttributes`,
          data
        );
        console.log(response);
      } catch (error) {
        console.log("error", error);
      }
    });
    await Promise.all(queue);
    res.status(201).json("Job concluded!");
  };
}

export { ProductController };
