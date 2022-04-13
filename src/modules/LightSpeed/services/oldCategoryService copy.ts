/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-loop-func */
/* eslint-disable consistent-return */
/* eslint-disable no-plusplus */
import categories from "../../QBP/database/categories.json";
import { IProductInterface } from "../../QBP/models/ProductInterface";

class CategoryService {
  handle(product: IProductInterface) {
    const categoriesMock = categories.categories;
    const categoryCode = product.data.categoryCodes.map(
      (category: string | null) => {
        return category;
      }
    );
    console.log("categoryCode", categoryCode);
    const data: any = [];
    categoryCode.forEach((categoryCode) => {
      while (categoryCode !== "g0") {
        const category = categoriesMock.find(
          ({ code }) => code === categoryCode
        );
        if (!category) {
          return;
        }

        data.push({
          name: category.name,
          fullPathName: category.name, // fazer breadcrumbs
          parentID: category.parentCode,
        });

        // eslint-disable-next-line no-param-reassign
        categoryCode = category.parentCode;
      }
    });

    const config = data;
    console.log(data, "data");
    return config;
  }
}

export { CategoryService };
