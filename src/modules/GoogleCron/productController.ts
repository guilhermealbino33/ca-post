import { Request, Response } from "express";
import api, { createToken } from "services/api";
import { utils } from "utils/utils";

import { IQueueAdvisorUpdate } from "./models/QueueAdvisorUpdate";
import queueAdvisorService from "./Services/queueAdvisorService";

class ProductController {
  products = async (req: Request, res: Response) => {
    const headers = {
      "Content-Type": "multipart/mixed; boundary=changeset",
    };

    const codes = await queueAdvisorService.pullQueue(30);
    let body;

    await createToken();
    codes.forEach(async (item: IQueueAdvisorUpdate, i: number) => {
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
        const resCode = await api.get(
          `/v1/products?$filter=Sku eq '${product.data.manufacturerPartNumber}'&$select=ID`
        );
        const code = resCode.data.value[0].ID;
        console.log(`code ${resCode.data.value[0].ID}`);

        body = {
          requests: [
            {
              id: i,
              method: "post",
              url: `/v1/Products(${code})/UpdateAttributes`,
              headers: {
                "Retry-After": 3600,
              },
              body: data,
            },
          ],
        };
        // await api.post(`/v1/Products(${code})/UpdateAttributes`, data);
      } catch (error) {
        console.log("error");
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

export { ProductController };
