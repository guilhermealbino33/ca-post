import api from "services/api";

type ParentProduct = {
  Sku: string;
  IsParent?: boolean;
  IsInRelationship?: boolean;
  Brand: string;
  Title: string;
  Description: string;
  ShortDescription: string;
  VaryBy?: string;
};

class CreateParentProductService {
  handle = async ({
    Sku,
    Brand,
    Description,
    ShortDescription,
    Title,
  }: ParentProduct): Promise<string> => {
    console.log("ENTERED");
    const headers = {
      "Content-Type": "application/json",
    };
    const body = {
      Sku: `PARENT-${Sku}`,
      IsParent: true,
      IsInRelationship: true,
      Brand,
      Title,
      Description,
      ShortDescription,
      VaryBy: "Choose Option",
    };
    try {
      await api.post(`/v1/Products`, JSON.stringify(body), {
        headers,
      });
      return `Product created SKU ${body.Sku}`;
    } catch (e) {
      console.log(e);
      return `Error creating product SKU ${body.Sku}`;
    }
  };
}

export { CreateParentProductService };
