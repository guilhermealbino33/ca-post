/* eslint-disable no-loop-func */
/* eslint-disable consistent-return */
/* eslint-disable no-plusplus */
import { IProductInterface } from "modules/QBP/models/ProductInterface";

import categories from "../../QBP/database/categories.json";

class CategoryService {
  handle(product: IProductInterface) {
    const categoriesMock = categories.categories;
    // console.log("product code", product.data.code);

    let categoryCode = product.data.categoryCodes[0];
    const data = [];
    let index = 1;

    while (categoryCode !== "g0") {
      const category = categoriesMock.find(({ code }) => code === categoryCode);
      if (!category) {
        return;
      }

      data.push({
        Name: `QBP Category ${index++}`,
        Value: category.name,
      });

      categoryCode = category.parentCode;
    }

    // console.log("data", data);
    const config = {
      Value: {
        Attributes: data,
      },
    };

    return config;
  }
}

export { CategoryService };
