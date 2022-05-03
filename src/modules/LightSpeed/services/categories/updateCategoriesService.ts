/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-loop-func */
/* eslint-disable consistent-return */
/* eslint-disable no-plusplus */
import fs from "fs";
import { ICategory } from "modules/LightSpeed/interfaces/ICategoryInterface";
import api, { getToken } from "services/LightSpeed/api";
import { lockRequest } from "utils/lock-request/lock-request";

import categories from "../../../QBP/database/categories.json";

export class UpdateCategoriesService {
  async execute(): Promise<any> {
    const categoriesMock = categories.categories as any;

    for (const category of categoriesMock) {
      const data = {
        name: category.name,
      };
      const createdCategory = await this.createCategory(data);
      // console.log("createdCategory", createdCategory);
      const categoryId = createdCategory.Category.categoryID;
      console.log("categoryId :", categoryId);

      category.lightspeedID = categoryId;
    }
    fs.writeFile(
      "src/modules/QBP/database/categories-common-codes.json",
      JSON.stringify(categoriesMock),
      (err) => {
        // Checking for errors
        if (err) throw err;

        console.log("Done writing");
      }
    );
    for (const category of categoriesMock) {
      const parentId = await this.findParentID(category, categoriesMock);
      // console.log("category new for", category);
      // console.log("parentId new for", parentId);
      const data = {
        parentID: parentId,
      };
      // console.log("data", data);
      const categoryId = await this.findID(category, categoriesMock);
      await this.updateCategory(data, categoryId);
      // console.log("createdCategory", createdCategory);
      // console.log("categoryId new for:", categoryId);
      // console.log("data new for:", data);
    }
  }

  private async findID(
    category: ICategory,
    createdCategories: ICategory[]
  ): Promise<string> {
    if (category.code === null) {
      return "0";
    }
    const foundCategory = createdCategories.find(
      (createdCategory) => createdCategory.code === category.code
    );
    if (!foundCategory) return "";

    return foundCategory.lightspeedID;
  }
  private async findParentID(
    category: ICategory,
    createdCategories: ICategory[]
  ): Promise<string> {
    if (category.parentCode === null) {
      return "0";
    }
    const foundCategory = createdCategories.find(
      (createdCategory) => createdCategory.code === category.parentCode
    );
    if (!foundCategory) {
      return "0";
    }
    return foundCategory.lightspeedID;
  }

  private async createCategory(body: any): Promise<any> {
    const token = await getToken();
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    try {
      const response = await api.post(
        `/API/V3/Account/${process.env.ACCOUNT_ID}/Category.json`,
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

  private async updateCategory(body: any, categoryId: string): Promise<any> {
    const token = await getToken();
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    try {
      const response = await api.put(
        `/API/V3/Account/${process.env.ACCOUNT_ID}/Category/${categoryId}.json`,
        body,
        {
          headers,
        }
      );

      await lockRequest(response);
    } catch (error) {
      console.log(error);
      return "error";
    }
  }
}
