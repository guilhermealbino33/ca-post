/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import api, { getAuthToken } from "services/LightSpeed/api";
import queueService from "services/Queue";
import { IQueueInterface } from "services/Queue/interfaces/interfaces";

import { GetItemsByManufacturerSkuService } from "../services/getItemsByManufacturerSkuService";

class UpdateItemController {
  handle = async (req: Request, res: Response) => {
    const getItemsByManufacturerSkuService =
      new GetItemsByManufacturerSkuService();

    const token = await getAuthToken();
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    const products = await queueService.pullImageQueue(50);
    interface IItemInterface {
      id: string;
      categoryId: string[];
      categoryName?: string;
    }

    const items: IItemInterface[] = [];

    for (const item of products) {
      const { product } = item;
      if (!product) {
        return;
      }
      const itemId = await getItemsByManufacturerSkuService.handle(
        product.data.manufacturerPartNumber,
        token
      ); /* REVER A QUESTAO DO TOKEN */
      if (itemId !== "") {
        items.push({
          id: itemId,
          categoryId: product.data?.categoryCodes,
        });
      }
    }

    // console.log("items", items);

    items.forEach((item) => {
      const url = `/API/V3/Account/{accountID}/Item/${item.id}.json`;
      const categoryCode = item.categoryId.map((category: string | null) => {
        return category;
      });

      /**
       * Verificar:
       * - Itens com mais de uma categoria
       * - Se há possibilidade de criar categoria com um QBP CODE para usar de referencia
       * - Testar rota put categories no postman
       * - Fazer for nas categorias dentro deste for procurando as correspondentes na LightSpeed
       */

      const body = {
        categoryID: item.categoryId[0],
      };
      console.log("url", url);
      console.log("body", body);
    });

    try {
      // const apiReturn = await api.get(
      //   `/API/V3/Account/{accountID}/Item/${itemId}.json`,
      //   {
      //     headers,
      //   }
      // );
      return res.json("apiReturn.data");
    } catch (e: any) {
      return console.log("Error", e);
    }
  };
}
export { UpdateItemController };
