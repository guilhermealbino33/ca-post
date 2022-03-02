/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "services/api";

type ChildProduct = {
  Sku: string;
  IsParent: string;
  IsInRelationship: string;
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
      const apiTest = await api.post(`/v1/Products`, JSON.stringify(body), {
        headers,
      });
      console.log("ThirdPartyAllowed", ThirdPartyAllowed);
      console.log("apiTest", apiTest.data.ID);

      if (ThirdPartyAllowed === true) {
        try {
          await api.post(
            `/v1/$batch`,
            JSON.stringify({
              requests: [
                {
                  id: 0,
                  method: "put",
                  url: `/v1/Products(${apiTest.data.ID})/Labels('eBay Fixed')`,
                  headers: {
                    "Content-Type": "application/json",
                    "Content-Length": "0",
                  },
                },
                {
                  id: 1,
                  method: "put",
                  url: `/v1/Products(${apiTest.data.ID})/Labels('Incycle.com')`,
                  headers: {
                    "Content-Type": "application/json",
                    "Content-Length": "0",
                  },
                },
              ],
            })
          );
        } catch (e: any) {
          console.log("Error", e.response);
        }
      } else {
        const link = `'Incycle.com'`;
        try {
          await api.patch(
            `/v1/Products(${apiTest.data.ID})/Labels(${link})`,
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
      console.log("Error", e.response.data);
      return console.log(`Error creating child product SKU ${body.Sku}`);
    }
  };
}

export { CreateChildProductService };
