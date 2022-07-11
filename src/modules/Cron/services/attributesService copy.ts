/* eslint-disable no-continue */
/* eslint-disable consistent-return */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-plusplus */
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

    const arrayValues: IAttribQBP[] = [];

    const duplicatedTarget: IAttribQBP[] = [];
    const getDuplicatedElement = (attribute: IAttribQBP) => {
      return product.data.productAttributes.filter(
        (item) => item.name === attribute.name
      );
    };

    const names = product.data.productAttributes.map(
      (attributes) => attributes.name
    );

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
    // esse for deveria ser em cima dos valores externos?
    let outerIndex = 0;
    for (const attribute of product.data.productAttributes) {
      const isDuplicatedTarget = duplicatedTarget.find(
        (item) => item.name === attribute.name
      );
      if (isDuplicatedTarget) {
        console.log("entrou isDuplicatedTarget");
        continue;
      }

      let duplicatedTargets = getDuplicatedElement(attribute);

      for (let index = 0; index < duplicates.length; index++) {
        if (outerIndex <= duplicates.length) {
          const duplicatesValues = product.data.productAttributes.filter(
            (attributes) => attributes.name === duplicates[0]
          );
          const value = duplicatesValues.map((attributes) => attributes.value);
          const name = duplicates[0] as string;

          const attribute = {
            name,
            value: value.join(", "),
          };

          arrayValues.push(attribute);
          duplicatedTargets.forEach((item) => {
            duplicatedTarget.push(item);
          });
          duplicatedTargets = [];
        }
      }

      console.log("entrou else");
      arrayValues.push(attribute);
    }

    arrayValues.map((attrib) => console.log(attrib));

    arrayValues.forEach((attrib: IAttribQBP, i: number) => {
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
    outerIndex++;
    return data;
  }
}

export { AttributesService };
