/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "services/api";

type ChildProduct = {
  Sku: string;
  IsParent: string;
  IsInRelationship: string;
  ParentSku?: string;
  ParentProductID: string;
  Title: string;
  Attributes: object;
  ThirdPartyAllowed: boolean;
};

class CreateChildProductService {
  handle = async ({
    Sku,
    ParentProductID,
    Title,
    IsParent,
    IsInRelationship,
    Attributes,
    ThirdPartyAllowed,
  }: ChildProduct) => {
    const headers = {
      "Content-Type": "application/json",
    };

    const body = {
      Sku,
      ParentProductID,
      IsParent,
      IsInRelationship,
      Title,
      Attributes,
    };

    try {
      const childProduct = await api.post(
        `/v1/Products`,
        JSON.stringify(body),
        {
          headers,
        }
      );

      if (ThirdPartyAllowed === true) {
        try {
          await api.post(
            `/v1/$batch`,
            JSON.stringify({
              requests: [
                {
                  id: "0",
                  method: "put",
                  url: `/v1/ProductLabels(ProductID=${childProduct.data.ID}, Name='eBay Fixed')`,
                  headers: {
                    "Content-Type": "application/json",
                    "Content-Length": "0",
                  },
                },
                {
                  id: "1",
                  method: "put",
                  url: `/v1/ProductLabels(ProductID=${childProduct.data.ID}, Name='Incycle.com')`,
                  headers: {
                    "Content-Type": "application/json",
                    "Content-Length": "0",
                  },
                },
              ],
            }),
            { headers }
          );
        } catch (e: any) {
          console.log(
            `Error creating child product SKU ${body.Sku}`,
            e.response.data
          );
        }
      } else {
        try {
          await api.patch(
            `/v1/Products(${childProduct.data.ID})/Labels('Incycle.com')`,
            null,
            {
              headers: {
                "Content-Type": "application/json",
                "Content-Length": "0",
              },
            }
          );
        } catch (e: any) {
          console.log("Error", e.response.data);
        }
      }

      return console.log(`Child product created SKU ${body.Sku}`);
    } catch (e: any) {
      return console.log(
        `Error creating child product SKU ${body.Sku}`,
        e.response.data
      );
    }
  };
}

export { CreateChildProductService };
