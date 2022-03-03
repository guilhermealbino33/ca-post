/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "services/api";

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
  handle = async ({
    Sku,
    Brand,
    Description,
    ShortDescription,
    Title,
    VaryBy,
  }: ParentProduct): Promise<any> => {
    const headers = {
      "Content-Type": "application/json",
      "Retry-After": "3600",
    };
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
    try {
      const createParent = await api.post(
        `/v1/Products`,
        JSON.stringify(body),
        {
          headers,
        }
      );
      console.log(`parent product created SKU ${body.Sku}`);
      return createParent.data;
    } catch (e: any) {
      return console.log(
        `Error creating product SKU ${body.Sku}`,
        e.response.data
      );
    }
  };
}

export { CreateParentProductService };
