/* eslint-disable @typescript-eslint/no-explicit-any */
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
  handle = (parentProduct: ParentProduct, index: number): IBatchBody => {
    const { Sku, Brand, Description, ShortDescription, Title, VaryBy } =
      parentProduct;

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
      id: `parent-${index}`,
      method: "post",
      url: "/v1/Products",
      body,
      headers: {
        "Content-Type": "application/json",
      },
    };
    console.log(`Parent product SKU ${body.Sku} created`);
    return config;
  };
}

export { CreateParentProductService };
