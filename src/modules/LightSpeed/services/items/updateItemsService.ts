/* eslint-disable no-plusplus */
/* eslint-disable consistent-return */
/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { ICategory } from "modules/LightSpeed/interfaces/ICategoryInterface";
import apiCentralizer, { getAuthToken } from "services/Centralizer/api";
import api, { getToken } from "services/LightSpeed/api";
import { URLSearchParams } from "url";
import { lockRequest } from "utils/lock-request/lock-request";

import categories from "../../../QBP/database/categories-common-codes.json";

export class UpdateItemsService {
  async execute(): Promise<any> {
    const categoriesMock = categories as any;
    const commonProducts = [];

    for (let index = 0; index < 9999; index++) {
      const _commonProducts = await this.getCommonLshQbpItems(index);

      if (_commonProducts) {
        commonProducts.push(_commonProducts);
      } else {
        break;
      }
    }

    for (const item of commonProducts) {
      const commonItem = {
        code: item.qbpProduct.categoryCodes[
          item.qbpProduct.categoryCodes.length - 1
        ],
        lightspeedID: item.lshProduct.itemID,
      };

      const foundID = await this.findID(commonItem, categoriesMock);

      const data = {
        categoryID: foundID,
      };
      console.log("commonItem", commonItem);
      console.log("body", data);
      // await this.updateItem(data, commonItem.lightspeedID);
    }
  }
  private async getCommonLshQbpItems(page: number) {
    // recebe parametro page e passa para o axiosParams
    try {
      const token = await getAuthToken();
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      const response = await apiCentralizer.get(
        "/products/common-products-lsh-qbp",
        {
          headers,
          params: await this.axiosParams(page),
        }
      );
      // console.log("response", response);
      return response.data as any;
    } catch (error) {
      console.log("error");
      return error;
    }
  }
  private async updateItem(body: any, itemId: string): Promise<any> {
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
  private async findID(
    category: ICategory,
    createdCategories: ICategory[]
  ): Promise<any> {
    if (category.code === null) {
      return "0";
    }
    const foundCategory = createdCategories.find(
      (createdCategory) => createdCategory.code === category.code
    );
    if (foundCategory) {
      return foundCategory.lightspeedID;
    }
  }
  private async axiosParams(page: number) {
    const params = new URLSearchParams();
    params.append("page", String(page));
    params.append("limit", "100");
    console.log("params", params);
    return params;
  }
}
