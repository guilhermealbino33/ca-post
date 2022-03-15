/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, response, Response } from "express";
import api, { createToken } from "services/api";
import { utils } from "utils/utils";

import { IBatchBody } from "../interfaces/Interfaces";
import { IQueueAdvisorUpdate } from "../models/QueueAdvisorUpdate";
import { CreateChildProductService } from "../Services/createChildProductService ";
import { CreateParentProductService } from "../Services/createParentProductService";
import { GetProductsBySkuService } from "../Services/getProductsBySkuService";
import { ImageService } from "../Services/imageService";
import queueAdvisorService from "../Services/queueAdvisorService";
import { ThirdPartyAllowedService } from "../Services/thirdPartyAllowedService";
import { UpdateAttributeService } from "../Services/updateAttributeService";

class ProductController {
  handle = async (req: Request, res: Response) => {
    const { toHtml, removeDuplicatedWordsBetween } = utils;

    const createParentProductService = new CreateParentProductService();
    const createChildProductService = new CreateChildProductService();
    const updateAttributeService = new UpdateAttributeService();
    const getProductsBySkuService = new GetProductsBySkuService();
    const thirdPartyAllowedService = new ThirdPartyAllowedService();
    const imageService = new ImageService();

    const headers = { "Content-Type": "application/json" };
    const queue = await queueAdvisorService.pullQueue(20);
    const batchBody: IBatchBody[] = [];
    const codesResponse: string[] = ["Job concluded!"];
    await createToken();

    const codes = await getProductsBySkuService.handle(
      queue.map((item) => item.product?.data.manufacturerPartNumber)
    );

    const createdParents: {
      id: string;
      queuePosition: number;
      childData: any;
    }[] = [];

    queue.forEach(async (item: IQueueAdvisorUpdate, i: number) => {
      const { product } = item;
      // console.log("product", product);
      if (!product || !product?.data) {
        console.log(`Product not exists`);
        return;
      }
      const data = updateAttributeService.handle(product);
      // console.log("codes.data.responses", codes.data.responses);
      const code = codes.data.responses.find(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (code: any) =>
          code?.body.value?.[0]?.Sku === product.data.manufacturerPartNumber ||
          code?.body.value?.[0]?.Sku === product.data.code ||
          code?.body.value?.[0]?.Sku === `PARENT-${product.data.model.code}`
      );

      if (code?.body.value?.length === 0 || !code) {
        // console.log("MPN", product.data.manufacturerPartNumber);
        const newParentRequest = createParentProductService.handle(
          {
            Sku: product.data.model.code,
            Brand: product.data.brand.name,
            Description: product.data.model.description,
            ShortDescription: toHtml(product.data.model.bulletPoints),
            Title: `${product.data.brand.name} ${product.data.model.name}`,
            VaryBy: "Choose Option",
          },
          i
        );

        createdParents.push({
          id: `PARENT-${product.data.model.code}`,
          queuePosition: i,
          childData: data,
        });
        batchBody.push(newParentRequest);
      }

      codesResponse.push(code?.body.value?.[0].ID);
      // console.log(`${i} - code: ${code?.body.value[0].ID}`);

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

    /*
    verificar de instanciar variavel global como LASTSKU antes do FOR
    se LASTSKU for !== 0 ou null, cai no processo de verificação
    
    console.log("batchBody", batchBody);
    console.log("createdParents", createdParents);
    */
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

      // se não criou parent, não precisa entrar aqui
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
          .map(({ ID: channelId, Sku }, index): any => {
            const createdParent = createdParents.find(({ id }) => id === Sku);

            const productPosition = createdParent?.queuePosition;
            if (!productPosition) return;

            const { product } = queue[productPosition];
            // eslint-disable-next-line consistent-return
            const creatingChild = createChildProductService.handle(
              {
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
              },
              index
            );
            if (!creatingChild) {
              return;
            }
            console.log("product data", product.data);
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
                  index,
                }) /** ...imageServicehandle handle Images */,
              ];
            })
            .reduce((previous, current) => [...previous, ...current]);

          // await api.post(
          //   `/v1/$batch`,
          //   JSON.stringify({
          //     requests: batchPopulate,
          //   }),
          //   {
          //     headers,
          //   }
          // );
        }
      }
    } catch (e: any) {
      console.log("Error", e.response);
    }

    res.status(201).json(codesResponse);
  };
}

export { ProductController };
