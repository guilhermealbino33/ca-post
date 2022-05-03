import { utils } from "utils/utils";

import { IProductInterface } from "../../QBP/models/ProductInterface";

type IAttribQBP = {
  name: string;
  value: string;
};

class AttributesService {
  handle(product: IProductInterface) {
    const { toHtml, removeDuplicatedWordsBetween, nonZeroReturn } = utils;

    const data = {
      Value: {
        Attributes: [
          {
            Name: "QBP Code",
            Value: product.data.code,
          },
          {
            Name: "QBP Name",
            Value: removeDuplicatedWordsBetween(
              product.data.name,
              product.data.model.name,
              product.data.brand.name
            ),
          },
          {
            Name: "Choose Option",
            Value: removeDuplicatedWordsBetween(
              product.data.name,
              product.data.model.name,
              product.data.brand.name
            ),
          },
          {
            Name: "QBP Model",
            Value: `${product.data.brand.name} ${product.data.model.name}`,
          },
          {
            Name: "QBP Description",
            Value: product.data.model.description,
          },
          {
            Name: "QBP Short Description",
            Value: toHtml(product.data.model.bulletPoints),
          },
          {
            Name: "QBP Cost",
            Value: JSON.stringify(product.data.basePrice),
          },
          {
            Name: "QBP MAP",
            Value: nonZeroReturn(product.data.mapPrice),
          },
          {
            Name: "QBP MSRP",
            Value: nonZeroReturn(product.data.msrp),
          },
          {
            Name: "QBP Brand",
            Value: product.data.brand.name,
          },
          {
            Name: "QBP Discontinued",
            Value: JSON.stringify(product.data.discontinued),
          },
          {
            Name: "QBP Thirdpartyallowed",
            Value: JSON.stringify(product.data.thirdPartyAllowed),
          },
        ],
      },
    };

    product.data.productAttributes.forEach((attrib: IAttribQBP, i: number) => {
      const name = {
        Name: `MetafieldName${1 + i}`,
        Value: attrib.name,
      };
      data.Value.Attributes.push(name);
      const value = {
        Name: `MetafieldValue${1 + i}`,
        Value: attrib.value,
      };
      data.Value.Attributes.push(value);
    });
    console.log("data", JSON.stringify(data));
    return data;
  }
}

export { AttributesService };
