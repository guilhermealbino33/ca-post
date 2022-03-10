import { IBatchBody } from "../interfaces/Interfaces";

class ThirdPartyAllowedService {
  handle = (
    childProductId: string,
    images: string[],
    ThirdPartyAllowed: boolean,
    index: number
  ): IBatchBody[] => {
    const headers = {
      "Content-Type": "application/json",
      "Content-Length": "0",
    };
    let config;

    if (ThirdPartyAllowed === true) {
      config = [
        {
          id: `true ${index}`,
          method: "put",
          url: `/v1/ProductLabels(ProductID=${childProductId}, Name='eBay Fixed')`,
          headers,
        },
        {
          id: `true ${index + 1}`,
          method: "put",
          url: `/v1/ProductLabels(ProductID=${childProductId}, Name='Incycle.com')`,
          headers,
        },
      ];
    } else {
      config = [
        {
          id: `false ${index}`,
          method: "put",
          url: `/v1/ProductLabels(ProductID=${childProductId}, Name='Incycle.com')`,
          headers,
        },
      ];
    }
    return config;
  };
}
export { ThirdPartyAllowedService };
