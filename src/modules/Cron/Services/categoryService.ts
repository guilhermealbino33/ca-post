import { IProductInterface } from "modules/QBP/models/ProductInterface";

import categories from "../../QBP/database/categories.json";
import { IAttribute } from "../interfaces/Interfaces";

class CategoryService {
  handle(product: IProductInterface) {
    const attributes: IAttribute[] = [];
    const categoriesMock = categories.categories;
    console.log("product code", product.data.code);
    /**
     * TODO
       FAZER FOR SEMELHANTE AOS DO METAFIELDS.
       Criar array ATTRIBUTES
       Criar variaveis NAME CODE E PARENT
       A cada passada no for, dar um push nos dados
       
       Por montar o body com esse array criado
       */

    const categoryCode = categoriesMock.find(
      ({ code }) => code === product.data.categoryCodes[0]
    );
    if (!categoryCode) {
      return;
    }
    const data = {
      Attributes: [{ Name: `QBP Category 1`, Value: categoryCode.name }],
    };
    // while (
    //   product.data.categoryCodes[0] !== "g0" ||
    //   product.data.categoryCodes?.length === 0
    // ) {
    //   }
    const parentCodes = categoriesMock.find(
      ({ code }) => code === categoryCode.parentCode
    );
    if (!parentCodes) {
      return;
    }
    const categoryParentName = {
      Name: `QBP Category 2`,
      Value: parentCodes.name,
    };
    data.Attributes.push(categoryParentName);

    const grandParentCodes = categoriesMock.find(
      ({ code }) => code === parentCodes.parentCode
    );
    if (!grandParentCodes) {
      return;
    }
    const categoryGrandParentName = {
      Name: `QBP Category 3`,
      Value: grandParentCodes.name || "",
    };
    data.Attributes.push(categoryGrandParentName);

    const grandParent2Codes = categoriesMock.find(
      ({ code }) => code === grandParentCodes.parentCode
    );
    if (!grandParent2Codes) {
      return;
    }
    if (grandParent2Codes.code !== "g0") {
      const categoryGrandParent2Name = {
        Name: `QBP Category 4`,
        Value: grandParent2Codes.name,
      };
      data.Attributes.push(categoryGrandParent2Name);
      const grandParent3Codes = categoriesMock.find(
        ({ code }) => code === grandParent2Codes.parentCode
      );
      if (!grandParent3Codes) {
        return;
      }
      if (grandParent3Codes.code !== "g0") {
        const categoryGrandParent3Name = {
          Name: `QBP Category 5`,
          Value: grandParent3Codes.name,
        };
        data.Attributes.push(categoryGrandParent3Name);
      }
    }
    // });
    // }

    console.log("data", data);
    // return data;

    // const data = {
    //   Name: `QBP Category ${i + 1}`,
    //   Value: "Value",
    // };

    // const config = {
    //   id: String(i),
    //   method: "post",
    //   url: `/v1/Products(${productID})/UpdateAttributes`,
    //   body: {
    //     data,
    //   },
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // };
    // console.log(`${i + 1} - code ${productID}`);
    // batchBody.push(config);

    // product.data.productAttributes.forEach((attrib: IAttribQBP, i: number) => {
    //   const attribute = {
    //     Name: `Metafield${1 + i}`,
    //     Value: `• ${attrib.name}: ${attrib.value}`,
    //   };
    //   data.Value.Attributes.push(attribute);
    // });
  }
}

export { CategoryService };
