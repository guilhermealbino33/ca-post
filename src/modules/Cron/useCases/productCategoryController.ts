/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import api, { createToken } from "services/api";

import categories from "../../QBP/database/categories.json";
import { IAttribute, IBatchBody } from "../interfaces/Interfaces";
import { IQueueAdvisorUpdate } from "../models/QueueAdvisorUpdate";
import { GetProductsBySkuService } from "../Services/getProductsBySkuService";
import queueAdvisorService from "../Services/queueAdvisorService";

class ProductCategoryController {
  handle = async (req: Request, res: Response) => {
    await createToken();
    const getProductsBySkuService = new GetProductsBySkuService();
    const categoriesMock = categories.categories;
    const headers = {
      "Content-Type": "application/json",
    };
    const batchBody: IBatchBody[] = [];
    const attributes: IAttribute[] = [];
    const queue = await queueAdvisorService.pullQueue(5);

    const sku = queue.map(
      (item) => item.product?.data.manufacturerPartNumber ?? item.product?.code
    );

    const codes = await getProductsBySkuService.handle(sku);

    queue.forEach(async (item: IQueueAdvisorUpdate, i: number) => {
      const { product } = item;
      console.log("category", product.data.categoryCodes);
      console.log("product", product.code);
      const productID = codes.data?.responses[i]?.body.value[0]?.ID;

      if (!productID || !product) {
        console.log(`*************** Sku ${sku} not found ***************`);
        return;
      }
      // console.log("categories", categories.categories[1]);
      // let categoryCode = "";
      let parent: string | null;
      // const name = "";

      /**
       FAZER FOR SEMELHANTE AOS DO METAFIELDS.
       Criar array ATTRIBUTES
       Criar variaveis NAME CODE E PARENT
       A cada passada no for, dar um push nos dados
       
       Por montar o body com esse array criado
       */

      while (
        product.data.categoryCodes[0] !== "g0" ||
        product.data.categoryCodes?.length === 0
      ) {
        categoriesMock.forEach((category): string | null => {
          if (category.code === product.data.categoryCodes[0]) {
            const categoryName = {
              Name: `QBP Category ${i + 1}`,
              Value: category.code,
            };

            attributes.push(categoryName);
          }
        });
      }
      console.log("attributes", attributes);
      // for (let i = 0; i < categoriesMock.length; i++) {
      //   console.log("categoryCodeName", categoryCode);
      //   if (categoriesMock[i].code === product.data.categoryCodes[0]) {
      //     categoryCode = categoriesMock[i].name;
      //     parent = categoriesMock[i].parentCode;
      //     const categoryName = {
      //       Name: `QBP Category ${i + 1}`,
      //       Value: categoriesMock[i].name,
      //     };

      //     attributes.push(categoryName);
      //   }
      //   if (categoriesMock[i].code === parent) {
      //     const categoryParent = {
      //       Name: `QBP Category ${i + 1}`,
      //       Value: categoriesMock[i].name,
      //     };
      //     attributes.push(categoryParent);
      //   }
      // }
      // console.log("categoriesMock[i].code", categoriesMock[i].code);
      // console.log(
      //   "product.data.categoryCodes[i]",
      //   product.data.categoryCodes[i]
      // );
      // const result = categoriesMock.filter(function (code) {
      //   return code.categories.code === "chicken";
      // })[0].restaurant.name;

      const data = {
        Name: `QBP Category ${i + 1}`,
        Value: "Value",
      };

      const config = {
        id: String(i),
        method: "post",
        url: `/v1/Products(${productID})/UpdateAttributes`,
        body: {
          data,
        },
        headers: {
          "Content-Type": "application/json",
        },
      };
      console.log(`${i + 1} - code ${productID}`);
      batchBody.push(config);
    });
    // console.log(batchBody);
    try {
      // await api.post(
      //   `/v1/$batch`,
      //   JSON.stringify({
      //     requests: batchBody,
      //   }),
      //   {
      //     headers,
      //   }
      // );
      return res.json("Concluded");
    } catch (e: any) {
      return console.log("Error", e);
    }
  };
}
export { ProductCategoryController };
