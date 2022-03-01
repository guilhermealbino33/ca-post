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
  }: ParentProduct): Promise<void> => {
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
      api.post(`/v1/Products`, JSON.stringify(body), {
        headers,
      });
      return console.log(`Parent product created SKU ${body.Sku}`);
    } catch (e) {
      console.log(e);
      return console.log(`Error creating product SKU ${body.Sku}`);
    }
  };
}

export { CreateParentProductService };
