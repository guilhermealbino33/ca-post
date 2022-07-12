/* eslint-disable no-continue */
/* eslint-disable consistent-return */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-plusplus */
import { utils } from "utils/utils";

import { IProductInterface } from "../../QBP/models/ProductInterface";

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
            Value: `${toHtml(product.data.model.bulletPoints)}${toHtml(
              product.data.bulletPoints
            )}`,
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
    const { productAttributes } = product.data;

    const names = productAttributes.map((attributes) => attributes.name);

    const findDuplicates = (attrib: string[]) => {
      const sorted_arr = attrib.slice().sort();
      const results = [];
      for (let i = 0; i < sorted_arr.length - 1; i++) {
        if (sorted_arr[i + 1] === sorted_arr[i]) {
          results.push(sorted_arr[i]);
        }
      }
      return results;
    };

    const duplicates = findDuplicates(names);

    const duplicatesValues = productAttributes.filter(
      (attributes) => attributes.name === duplicates.find((name) => name)
    );

    const values = duplicatesValues.map((attributes) => attributes.value);

    const nonRepeated = productAttributes.filter(
      (attributes) =>
        attributes.name !== duplicates.find((attribute) => attribute)
    );

    const value = {
      name: duplicates.find((name) => name) as string,
      value: values.join(", "),
      unit: "",
    };
    nonRepeated.push(value);

    let index = 0;
    for (const attribute of nonRepeated) {
      const name = {
        Name: `MetafieldName${index + 1}`,
        Value: attribute.name,
      };

      data.Value.Attributes.push(name);

      const value = {
        Name: `MetafieldValue${index + 1}`,
        Value: attribute.value,
      };

      data.Value.Attributes.push(value);

      index++;
    }

    return data;
  }
}

export { AttributesService };
