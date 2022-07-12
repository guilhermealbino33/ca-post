import { v4 as uuidV4 } from "uuid";

import { IBatchBody } from "../interfaces/Interfaces";

type ChildProduct = {
  Sku: string;
  IsParent: string;
  IsInRelationship: string;
  ParentSku: string;
  ParentProductID: string;
  Title: string;
  Attributes: object;
  ThirdPartyAllowed: boolean;
  Images: string[];
};

class CreateChildProductService {
  handle = (childProduct: ChildProduct): IBatchBody => {
    const {
      Sku,
      IsParent,
      IsInRelationship,
      ParentSku,
      Title,
      Attributes,
      ParentProductID,
    } = childProduct;

    const headers = {
      "Content-Type": "application/json",
    };

    const body = {
      Sku,
      ParentSku,
      IsParent,
      IsInRelationship,
      Title,
      Attributes,
      ParentProductID,
    };

    const config = {
      id: String(uuidV4()),
      method: "post",
      url: "/v1/Products",
      body,
      headers,
    };
    console.log(`Child product SKU ${body.Sku} created`);
    return config;
  };
}

export { CreateChildProductService };
