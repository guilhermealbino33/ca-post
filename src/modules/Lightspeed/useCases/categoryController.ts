/* eslint-disable no-use-before-define */
/* eslint-disable no-continue */
/* eslint-disable no-unreachable-loop */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-loop-func */
import { Request, Response } from "express";
import api, { getAuthToken } from "services/LightSpeed/api";

import categories from "../../QBP/database/categories.json";
/* eslint-disable @typescript-eslint/no-explicit-any */

export async function createCategoryHandle(req: Request, res: Response) {
  try {
    const createdCategories: any = [];
    const categoriesMock = categories.categories;
    for (const category of categoriesMock) {
      const parentId = findParentID(category, createdCategories);

      console.log("parentId", parentId);
      const data = {
        name: category.name,
        parentID: parentId,
      };
      console.log("data", data);
      const createdCategory = await createCategory(data);
      console.log("createdCategory", createdCategory);
      const categoryId = createdCategory.Category.categoryID;
      console.log("categoryId :", categoryId);
      createdCategories.push({
        categoryID: categoryId,
        code: category.code,
      });
    }
    return res.json("Concluded");
  } catch (e: any) {
    return console.log("Error", e);
  }
}

function findParentID(category: any, createdCategories: any[]): any {
  // console.log("category inside", category);
  if (category.parentCode === null) {
    return "0";
  }
  const foundCategory = createdCategories.find(
    (createdCategory) => createdCategory.code === category.parentCode
  );
  return foundCategory.categoryID;
}

async function createCategory(body: any): Promise<any> {
  const token = await getAuthToken();
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
    return response.data;
  } catch (error) {
    console.log(error);
    return "error";
  }
}
