/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "services/api";

import { IBatchBody } from "../interfaces/Interfaces";

type ChildProduct = {
  Sku: string;
  IsParent: string;
  IsInRelationship: string;
  ParentSku?: string;
  ParentProductID: string;
  Title: string;
  Attributes: object;
  ThirdPartyAllowed: boolean;
  Images: string[];
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
    Images,
  }: ChildProduct) => {
    const headers = {
      "Content-Type": "application/json",
    };

    let count = 0;
    function incrementIndex() {
      // eslint-disable-next-line no-plusplus
      return count++;
    }

    const batchBody: IBatchBody[] = [];
    const batchProduct: IBatchBody[] = [];

    const body = {
      Sku,
      ParentProductID,
      IsParent,
      IsInRelationship,
      Title,
      Attributes,
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
    batchProduct.push(config);
    // console.log("batchProduct", batchProduct);
    try {
      const childProduct = await api.post(
        `/v1/$batch`,
        JSON.stringify({ requests: batchProduct }),
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
                  url: `/v1/ProductLabels(ProductID=${childProduct.data.responses[0].body.ID}, Name='eBay Fixed')`,
                  headers: {
                    "Content-Type": "application/json",
                    "Content-Length": "0",
                  },
                },
                {
                  id: "1",
                  method: "put",
                  url: `/v1/ProductLabels(ProductID=${childProduct.data.responses[0].body.ID}, Name='Incycle.com')`,
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
            `/v1/Products(${childProduct.data.responses[0].body.ID})/Labels('Incycle.com')`,
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

      if (Images.length > 0) {
        Images.map(async (image: string, i: number) => {
          const placementName = `'ITEMIMAGEURL${1 + i}'`;
          const config = {
            id: String(incrementIndex()),
            method: "patch",
            url: `/v1/Images(ProductID=${childProduct.data.responses[0].body.ID}, PlacementName=${placementName})`,
            body: {
              Url: `https://images.qbp.com/imageservice/image/1d59103516e0/prodxl/${image}`,
            },
            headers: {
              "Content-Type": "application/json",
            },
          };
          batchBody.push(config);
        });
        try {
          await api.post(
            `/v1/$batch`,
            JSON.stringify({ requests: batchBody }),
            {
              headers,
            }
          );
        } catch (e) {
          console.log(e);
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
