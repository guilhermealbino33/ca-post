/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import api, { createToken } from "services/api";
import { utils } from "utils/utils";

import { IBatchBody } from "../interfaces/Interfaces";
import { IQueueAdvisorUpdate } from "../models/QueueAdvisorUpdate";
import { CreateChildProductService } from "../Services/createChildProductService ";
import { CreateParentProductService } from "../Services/createParentProductService";
import { GetProductsBySkuService } from "../Services/getProductsBySkuService";
import queueAdvisorService from "../Services/queueAdvisorService";
import { UpdateAttributeService } from "../Services/updateAttributeService";

class ProductController {
  handle = async (req: Request, res: Response) => {
    const { toHtml, removeDuplicatedWordsBetween } = utils;

    const createParentProductService = new CreateParentProductService();
    const createChildProductService = new CreateChildProductService();
    const updateAttributeService = new UpdateAttributeService();
    const getProductsBySkuService = new GetProductsBySkuService();

    const queue = await queueAdvisorService.pullQueue(100);
    const headers = {
      "Content-Type": "application/json",
    };
    const batchBody: IBatchBody[] = [];
    const codesResponse: string[] = ["Job concluded!"];
    await createToken();

    const codes = await getProductsBySkuService.handle(
      queue.map((item) => item.product?.data.manufacturerPartNumber)
    );

    const lastSku = "";

    const createdParents: {
      id: string;
      queuePosition: number;
      childData: any;
    }[] = [];

    queue.forEach(async (item: IQueueAdvisorUpdate, i: number) => {
      const { product } = item;

      if (!product || !product?.data) {
        console.log(`Product not exists`);
        return;
      }
      const data = updateAttributeService.handle(product);

      const code = codes.data.responses.find(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (code: any) =>
          code?.body.value[0]?.Sku === product.data.manufacturerPartNumber ||
          code?.body.value[0]?.Sku === product.data.code ||
          code?.body.value[0]?.Sku === `PARENT-${product.data.model.code}`
      );

      if (code?.body.value.length === 0 || !code) {
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

      codesResponse.push(code?.body.value[0].ID);
      console.log(`${i} - code: ${code?.body.value[0].ID}`);

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

    */

    try {
      if (batchBody.length === 0) {
        res
          .status(201)
          .json("No products have been updated on Channel Advisor!");
        return;
      }

      const codes = await getProductsBySkuService.handle(
        createdParents.map((parent) => parent.id)
      );

      type CreatedParentType = { ID: string; Sku: string };

      const parents: CreatedParentType[] = codes.data.responses.map(
        (item: any) => item.body.value[0]
      );

      const batch = parents.map(({ ID: channelId, Sku }) => {
        const createdParent = createdParents.find(({ id }) => id === Sku);

        const productPosition = createdParent?.queuePosition;
        if (!productPosition) return {};

        const { product } = queue[productPosition];

        return createChildProductService.handle({
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
      });

      /**
       * @todo
       * -> executar variável batch com o request $batch, exemplo:
       * 
          await api.post(
            `/v1/$batch`,
            JSON.stringify({ requests: batch }),
            {
              headers,
            }
          );
       * 
       * -> createChildProductService.handle 
       *    deve retornar um request para criar o produto, apenas variavel "config"
       * 
       * -> usando a resposta do createChild, 
       *    criar um outro batch para usar o ThirdPartyAllowed e fazer o vínculo das imagens
       */
    } catch (e) {
      console.log(e);
    }

    res.status(201).json(codesResponse);
  };
}

export { ProductController };
