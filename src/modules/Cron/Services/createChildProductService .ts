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
  handle = (childProduct: ChildProduct, index: number): IBatchBody => {
    const {
      Sku,
      IsParent,
      IsInRelationship,
      ParentSku,
      ParentProductID,
      Title,
      Attributes,
    } = childProduct;
    const headers = {
      "Content-Type": "application/json",
    };

    const body = {
      Sku,
      ParentProductID,
      ParentSku,
      IsParent,
      IsInRelationship,
      Title,
      Attributes,
    };

    const config = {
      id: String(index),
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
