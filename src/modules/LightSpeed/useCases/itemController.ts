/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-use-before-define */

import { Request, Response } from "express";
import apiCentralizer, { getAuthToken } from "services/Centralizer/api";
import api, { getToken } from "services/LightSpeed/api";
import { lockRequest } from "utils/lock-request/lock-request";

import categories from "../../QBP/database/categories.json";
import { findID } from "../services/categoryService";
import { getCommonLshQbpItems } from "../services/itemService";

export async function updateItemsHandle(req: Request, res: Response) {
  // const getItemsByManufacturerSkuService =
  //   new GetItemsByManufacturerSkuService();
  const categoriesMock = categories.categories as any;
  const token = await getAuthToken();
  const items = await getCommonLshQbpItems(token);

  if (!items) return;

  for (const item of items) {
    const qbpCategoryCode = {
      code: item.qbpProduct.categoryCodes[0],
    };

    const lsh = item.lshProduct.itemID;

    findID(qbpCategoryCode, categoriesMock);

    const data = {
      categoryID: "category id after found it",
    };
    await updateItem(data, lsh);
  }
  //   /**
  //    * Verificar:
  //    * - Itens com mais de uma categoria
  //    * - Fazer for nas categorias dentro deste for procurando as correspondentes na LightSpeed
  //    * - dar um get na API Centralizer
  //    */
}
async function updateItem(body: any, itemId: string): Promise<any> {
  const token = await getToken();
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  try {
    const response = await api.put(
      `/API/V3/Account/${process.env.ACCOUNT_ID}/Item/${itemId}.json`,
      body,
      {
        headers,
      }
    );

    await lockRequest(response);

    return response.data;
  } catch (error) {
    console.log(error);
    return "error";
  }
}
