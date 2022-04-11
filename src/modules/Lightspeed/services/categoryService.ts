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
          fullPathName: "Bath/acessories", // fazer breadcrumbs
          parentID: category.parentCode,
        });

        // fazer api para baixar a api da lightspeed

        // eslint-disable-next-line no-param-reassign
        categoryCode = category.parentCode;
      }
    });

    const config = {
      Value: {
        Attributes: data,
      },
    };
    console.log(config.Value.Attributes);
    return config;
  }
}

export { CategoryService };
