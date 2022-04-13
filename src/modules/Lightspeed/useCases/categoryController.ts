/* eslint-disable no-loop-func */
import { Request, Response } from "express";
import api, { getAuthToken } from "services/LightSpeed/api";

import categories from "../../QBP/database/categories.json";
import { IProductInterface } from "../../QBP/models/ProductInterface";
/* eslint-disable @typescript-eslint/no-explicit-any */

class CategoryController {
  handle = async (req: Request, res: Response) => {
    const token = await getAuthToken();
    const data: any = [];
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    const categoriesMock = categories.categories;

    categoriesMock.forEach((category) => {
      if (category.parentCode === "g0") {
        data.push({
          name: category.name,
        });
      }

      // switch (category.parentCode) {
      //   case "g0":
      //     data.push({
      //       name: category.name,
      //       // fullPathName: category.name, // fazer breadcrumbs
      //       parentID: category.parentCode,
      //     });

      //     break;
      //   case "cw-special-categories":
      //     data.push({
      //       name: category.name,
      //       // fullPathName: category.name, // fazer breadcrumbs
      //       parentID: category.parentCode,
      //     });

      //     break;

      //   default:
      //     break;
      // }

      // while (category.parentCode === "g0") {
      //   data.push({
      //     name: category.name,
      //     // fullPathName: category.name, // fazer breadcrumbs
      //     parentID: category.parentCode,
      //   });
      // }
    });
    console.log("data", data);
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
