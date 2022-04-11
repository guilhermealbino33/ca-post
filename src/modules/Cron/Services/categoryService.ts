/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-loop-func */
/* eslint-disable consistent-return */
/* eslint-disable no-plusplus */
import { IProductInterface } from "modules/QBP/models/ProductInterface";

import categories from "../../QBP/database/categories.json";

class CategoryService {
  handle(product: IProductInterface) {
    const categoriesMock = categories.categories;
    const categoryCode = product.data.categoryCodes.map(
      (category: string | null) => {
        return category;
      }
    );
    const data: any = [];
    let index = 1;
    categoryCode.forEach((categoryCode) => {
      while (categoryCode !== "g0") {
        const category = categoriesMock.find(
          ({ code }) => code === categoryCode
        );
        if (!category) {
          return;
        }

        data.push({
          Name: `QBP Category ${index++}`,
          Value: category.name,
        });

        // eslint-disable-next-line no-param-reassign
        categoryCode = category.parentCode;
      }
    });

    const config = {
      Value: {
        Attributes: data,
      },
    };
    return config;
  }
}

export { CategoryService };
