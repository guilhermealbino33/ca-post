import { Request, Response } from "express";
import api, { createToken } from "services/api";
import { utils } from "utils/utils";

import { IBatchBody } from "../interfaces/Interfaces";
import { IQueueAdvisorUpdate } from "../models/QueueAdvisorUpdate";
import { CreateChildProductService } from "../Services/createChildProductService ";
import { CreateParentProductService } from "../Services/createParentProductService";
import queueAdvisorService from "../Services/queueAdvisorService";

class ProductController {
  handle = async (req: Request, res: Response) => {
    const createParentProductService = new CreateParentProductService();
    const createChildProductService = new CreateChildProductService();

    const queue = await queueAdvisorService.pullQueue(10);
    const headers = {
      "Content-Type": "application/json",
    };
    const batchBody: IBatchBody[] = [];
    const codesResponse: string[] = ["Job concluded!"];
    await createToken();

    const bodyCodes = {
      requests: queue.map((item: IQueueAdvisorUpdate, index) => ({
        id: String(index),
        method: "get",
        url: `/v1/products?$filter=Sku eq '${item.product.data.manufacturerPartNumber}'&$select=ID, Sku, ParentProductID`,
      })),
    };
    const codes = await api.post(`/v1/$batch`, JSON.stringify(bodyCodes), {
      headers,
    });

    queue.forEach(async (item: IQueueAdvisorUpdate, i: number) => {
      const { product } = item;

      if (!product || !product.data) {
        console.log(`Product ${product.code} not exists`);
        return;
      }
      const { toHtml, removeDuplicatedWordsBetween } = utils;
      const data = {
        Value: {
          Attributes: [
            {
              Name: "QBP Code",
              Value: product.data.code,
            },
            {
              Name: "QBP Name",
              Value: removeDuplicatedWordsBetween(
                product.data.name,
                product.data.model.name,
                product.data.brand.name
              ),
            },
            {
              Name: "Choose Option",
              Value: removeDuplicatedWordsBetween(
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
              Value: toHtml(product.data.model.bulletPoints),
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
          code?.body.value[0]?.Sku === product.data.manufacturerPartNumber ||
          code?.body.value[0]?.Sku === product.data.code ||
          code?.body.value[0]?.ParentProductID ===
            `PARENT-${product.data.model.code}`
      );

      if (code?.body.value.length === 0 || !code) {
        const sku = await api.get(
          `/v1/products?$filter=Sku eq 'PARENT-${product.data.model.code}'&$select=ID, Sku`,
          { headers }
        );
        // console.log("MPN", product.data.manufacturerPartNumber);
        // console.log("Model code", `PARENT-${product.data.model.code}`);
        // console.log("SKU", sku.data.value[i]?.Sku);
        // console.log("SKU from CODE", code?.body.value[i]?.Sku);
        // console.log("ParentProductID", sku.data.value[i]?.ParentProductID);

        if (`PARENT-${product.data.model.code}` !== sku.data.value[i]?.Sku) {
          console.log(`Product ${product.code} not exists on Channel Advisor`);
          await createParentProductService.handle({
            Sku: product.data.model.code,
            Brand: product.data.brand.name,
            Description: product.data.model.description,
            ShortDescription: toHtml(product.data.model.bulletPoints),
            Title: `${product.data.brand.name} ${product.data.model.name}`,
            VaryBy: "Choose Option",
          });
          return;
        }
        if (`PARENT-${product.data.model.code}` === sku.data.value[i]?.Sku) {
          if (!product.data.manufacturerPartNumber) {
            // console.log(
            //   `in future call child without MPN, product ${product.code} here`
            // );

            createChildProductService.handle({
              Sku: product.code,
              IsParent: "False",
              IsInRelationship: "True",
              ParentProductID: sku.data.value[i]?.ID, // STUDY
              Title: `${product.data.brand.name} ${product.data.model.name}`,
              Attributes: data.Value.Attributes,
              ThirdPartyAllowed: product.data.thirdPartyAllowed,
            });
          } else {
            console.log("in future call child product here");

            createChildProductService.handle({
              Sku: product.data.manufacturerPartNumber,
              IsParent: "False",
              IsInRelationship: "True",
              ParentProductID: sku.data.value[i]?.ID,
              Title: `${product.data.brand.name} ${product.data.model.name}`,
              Attributes: data.Value.Attributes,
              ThirdPartyAllowed: product.data.thirdPartyAllowed,
            });
          }
        }
      }
      codesResponse.push(code?.body.value[0].ID);
      console.log(`code ${code?.body.value[0].ID}`);

      const config = {
        id: String(i),
        method: "post",
        url: `/v1/Products(${code?.body.value[0].ID})/UpdateAttributes`,
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      };
      batchBody.push(config);
    });
    try {
      // console.log("body ", { requests: batchBody });
      if (batchBody.length === 0) {
        res
          .status(201)
          .json("No products have been updated on Channel Advisor!");
        return;
      }

      await api.post(`/v1/$batch`, JSON.stringify({ requests: batchBody }), {
        headers,
      });
    } catch (e) {
      console.log(e);
    }

    res.status(201).json(codesResponse);
  };
}

export { ProductController };
