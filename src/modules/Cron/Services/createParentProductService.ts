/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "services/api";

import { IBatchBody } from "../interfaces/Interfaces";

type ParentProduct = {
  Sku: string;
  IsParent?: boolean;
  IsInRelationship?: boolean;
  Brand: string;
  Title: string;
  Description: string;
  ShortDescription: string;
  VaryBy: string;
};

class CreateParentProductService {
  handle = async (parentProducts: ParentProduct[]): Promise<any> => {
    const headers = {
      "Content-Type": "application/json",
    };
    let count = 0;
    function incrementIndex() {
      // eslint-disable-next-line no-plusplus
      return count++;
    }
    const batchBody: IBatchBody[] = [];

    parentProducts.forEach(
      ({ Sku, Brand, Description, ShortDescription, Title, VaryBy }) => {
        const body = {
          Sku: `PARENT-${Sku}`,
          IsParent: true,
          IsInRelationship: true,
          Brand,
          Title,
          Description,
          ShortDescription,
          VaryBy,
        };
        const config = {
          id: String(incrementIndex()),
          method: "post",
          url: "/v1/Products",
          body,
          headers: {
            "Content-Type": "application/json",
          },
        };
        batchBody.push(config);
      }
    );

    console.log("batchBody product", batchBody);
    try {
      const createParent = await api.post(
        `/v1/$batch`,
        JSON.stringify({ requests: batchBody }),
        {
          headers,
        }
      );
      // console.log("parent product", createParent.data.responses);
      // console.log(`parent product created SKU ${body.Sku}`);
      return createParent.data.responses;
    } catch (e: any) {
      return console.log("Error creating parent product", e.response.data);
    }
  };
}

export { CreateParentProductService };
