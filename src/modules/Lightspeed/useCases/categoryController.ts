/* eslint-disable no-restricted-syntax */
/* eslint-disable no-loop-func */
import { Request, Response } from "express";
import api, { getAuthToken } from "services/LightSpeed/api";

import categories from "../../QBP/database/categories.json";
import { IProductInterface } from "../../QBP/models/ProductInterface";
/* eslint-disable @typescript-eslint/no-explicit-any */

class CategoryController {
  handle = async (req: Request, res: Response) => {
    const token = await getAuthToken();
    const createdCategory: any = [];
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    let currentCode;
    const categoriesMock = categories.categories;

    interface ICategory {
      code?: string;
      name: string;
      parentCode: any;
      childCodes?: string[];
    }

    // function recurse(category: ICategory | any, index: number) {
    //   if (category?.childCodes.length > 0) {
    //     data.push({
    //       Name: category.name,
    //     });
    //     const i = index;
    //     const child = categoriesMock.find(
    //       ({ code }) => code === category.parentCode
    //     );
    //     console.log("child", child);

    //     recurse(child, i);
    //   }
    // }

    async function returnParentID(body: any, parentCode: any): Promise<any> {
      try {
        const parent = await api.post(
          `/API/V3/Account/${process.env.ACCOUNT_ID}/Category.json`,
          body,
          {
            headers,
          }
        );
        const parentID = parent.data.Category.categoryID;
        if (!parentID || parentID === undefined) {
          return "0";
        }
        createdCategory.push({
          parentID,
          parentCode,
        });
        return parentID.data.Category.parentID;
      } catch (error) {
        console.log(error);
        return "error";
      }
    }

    let parentCode: any | string;

    for (const category of categoriesMock) {
      console.log("parentCode", parentCode);
      const data = {
        name: category.name,
        parentID: parentCode,
      };
      console.log("DATA", data);
      parentCode = await returnParentID(data, category.parentCode);
      const newParentCode = createdCategory.find(
        (parentCode) => parentCode === category.parentCode
      );
      console.log("newParentCode", newParentCode);
    }

    /**
     * Armazenar os categories criados em um array com o ID vindo da lightspeed e o ID do JSON
     * Depois parentCode, fazer um find na array criada buscando o id desejado
     */

    try {
      // await api.post(
      //   `/API/V3/Account/${process.env.ACCOUNT_ID}/Category.json`,
      //   data,
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
export { CategoryController };
