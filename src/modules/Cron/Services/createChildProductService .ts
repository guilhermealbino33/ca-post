import api from "services/api";

type ChildProduct = {
  Sku: string;
  IsParent?: boolean;
  IsInRelationship?: boolean;
  ParentProductID: string;
  VaryBy: string;
  Title: string;
  Attributes: object;
};

class CreateChildProductService {
  handle = async ({
    Sku,
    ParentProductID,
    VaryBy,
    Title,
    Attributes,
  }: ChildProduct) => {
    console.log("ENTERED");
    // check for "thirdPartyAllowed" rule
    const headers = {
      "Content-Type": "application/json",
    };

    const body = {
      Sku,
      ParentProductID,
      VaryBy,
      IsParent: false,
      IsInRelationship: true,
      Title,
      Attributes,
    };

    try {
      await api.post(`/v1/Products`, JSON.stringify(body), {
        headers,
      });
      return console.log(`Child product created SKU ${body.Sku}`);
    } catch (e) {
      console.log(e);
      return console.log(`Error creating child product SKU ${body.Sku}`);
    }
  };
}

export { CreateChildProductService };
