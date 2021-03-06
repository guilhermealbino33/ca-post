/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import api, { createToken } from "services/ChannelAdvisor/api";
import queueService from "services/Queue";
import { IQueueInterface } from "services/Queue/interfaces/interfaces";
import { utils } from "utils/utils";
import { v4 as uuidV4 } from "uuid";

import { IBatchBody } from "../interfaces/Interfaces";
import { AttributesService } from "../services/attributesService";
import { CreateChildProductService } from "../services/createChildProductService ";
import { CreateParentProductService } from "../services/createParentProductService";
import { GetProductsBySkuService } from "../services/getProductsBySkuService";
import { ImageService } from "../services/imageService";
import { ThirdPartyAllowedService } from "../services/thirdPartyAllowedService";

class ProductController {
  handle = async (req: Request, res: Response) => {
    const { toHtml, removeDuplicatedWordsBetween } = utils;

    const createParentProductService = new CreateParentProductService();
    const createChildProductService = new CreateChildProductService();
    const attributeService = new AttributesService();
    const getProductsBySkuService = new GetProductsBySkuService();
    const thirdPartyAllowedService = new ThirdPartyAllowedService();
    const imageService = new ImageService();

    let lastSku: string;
    const queue = await queueService.pullQueue(60);
    const headers = { "Content-Type": "application/json" };
    const batchBody: IBatchBody[] = [];
    const codesResponse: string[] = ["Job concluded!"];

    await createToken();

    const sku = queue.map(
      (item) => item.product?.data.manufacturerPartNumber ?? item.product?.code
    );
    console.log("sku", sku);

    const parentSku = queue.map(
      (item) => `PARENT-${item.product?.data.model.code}`
    );
    console.log("parentSku", parentSku);

    const codes = await getProductsBySkuService.handle(sku);

    const parentCodes = await getProductsBySkuService.handle(parentSku);

    const createdParents: {
      id: string;
      queuePosition: number;
      childData: any;
    }[] = [];

    queue.forEach(async (item: IQueueInterface, i: number) => {
      const { product } = item;

      if (!product || !product?.data) {
        console.log(`Product not exists`);
        return;
      }
      const data = attributeService.handle(product);

      const code = codes.data.responses.find(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (code: any) =>
          code?.body.value?.[0]?.Sku === product.data.manufacturerPartNumber ||
          code?.body.value?.[0]?.Sku === product.data.code
      );
      if (code?.body.value?.length === 0 || !code) {
        const parentCode = parentCodes.data.responses.find(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (code: any) =>
            code?.body.value?.[i]?.Sku ===
            `PARENT-${item.product?.data.model.code}`
        );

        if (lastSku === `PARENT-${product.data.model.code}`) {
          console.log("Parent already created!");
          createdParents.push({
            id: `PARENT-${product.data.model.code}`,
            queuePosition: i,
            childData: data,
          });
          return;
        }
        if (parentCode?.body.value?.length === 0 || !parentCode) {
          const newParentRequest = createParentProductService.handle({
            Sku: product.data.model.code,
            Brand: product.data.brand.name,
            Description: product.data.model.description,
            ShortDescription: toHtml(product.data.model.bulletPoints),
            Title: `${product.data.brand.name} ${product.data.model.name}`,
            VaryBy: "Choose Option",
          });
          lastSku = `PARENT-${product.data.model.code}`;

          createdParents.push({
            id: `PARENT-${product.data.model.code}`,
            queuePosition: i,
            childData: data,
          });
          batchBody.push(newParentRequest);
        }
      }

      codesResponse.push(code?.body.value?.[0].ID);
      console.log(`${i + 1} - code: ${code?.body.value[0].ID}`);

      const config = {
        id: String(uuidV4()),
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
      if (batchBody.length === 0) {
        res
          .status(201)
          .json("No products have been updated on Channel Advisor!");
        return;
      }
      await api.post(`/v1/$batch`, JSON.stringify({ requests: batchBody }), {
        headers,
      });

      if (createdParents.length !== 0) {
        const codes = await getProductsBySkuService.handle(
          createdParents.map((parent) => parent.id)
        );

        type CreatedParentType = { ID: string; Sku: string };

        const parents: CreatedParentType[] = codes.data.responses.map(
          (item: any) => item.body.value[0]
        );

        const batch = parents
          .filter(Boolean)
          .map(({ ID: channelId, Sku }): any => {
            const createdParent = createdParents.find(({ id }) => id === Sku);

            const productPosition = createdParent?.queuePosition;
            if (!productPosition) return;

            const { product } = queue[productPosition];
            // eslint-disable-next-line consistent-return
            const creatingChild = createChildProductService.handle({
              Sku: product.data.manufacturerPartNumber ?? product.code,
              IsParent: "False",
              IsInRelationship: "True",
              ParentProductID: channelId,
              ParentSku: Sku,
              Title: removeDuplicatedWordsBetween(
                product.data.name,
                product.data.model.name,
                product.data.brand.name
              ),
              Attributes: createdParent.childData.Value.Attributes,
              ThirdPartyAllowed: product.data.thirdPartyAllowed,
              Images: product.data.images,
            });
            if (!creatingChild) {
              return;
            }
            // eslint-disable-next-line consistent-return
            return {
              creatingChild,
              ThirdPartyAllowed: product.data.thirdPartyAllowed,
              Images: product.data.images,
              SkuFromQBP: product.data.manufacturerPartNumber ?? product.code,
            };
          })
          .filter(Boolean);

        if (batch.length !== 0) {
          const createChild = await api.post(
            `/v1/$batch`,
            JSON.stringify({
              requests: batch.map((item) => item.creatingChild),
            }),
            {
              headers,
            }
          );

          type CreatedChildType = {
            ID: string;
            ThirdPartyAllowed: boolean;
            Images: string[];
            Sku: string;
          };
          const children: CreatedChildType[] = createChild.data.responses
            .map((item: any) => item.body)
            .filter((body: any) => !body.error);
          const batchPopulate = children
            .map(({ ID: childProductId, Sku }, index) => {
              const { ThirdPartyAllowed, Images } = batch.find(
                ({ SkuFromQBP }) => SkuFromQBP === Sku
              );
              return [
                ...thirdPartyAllowedService.handle({
                  childProductId,
                  ThirdPartyAllowed,
                }),
                ...imageService.handle({
                  childProductId,
                  Images,
                  index,
                }),
              ];
            })
            .reduce((previous, current) => [...previous, ...current], []);

          if (batchPopulate.length === 0) {
            res.status(500).json("An error ocurred!");
          }

          await api.post(
            `/v1/$batch`,
            JSON.stringify({
              requests: batchPopulate,
            }),
            {
              headers,
            }
          );
        }
      }
      res.status(200).json("Success!");
    } catch (e: any) {
      res.status(500).json(e.response.data);
      console.log("error");
    }
  };
}

export { ProductController };
