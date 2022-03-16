import { v4 as uuidV4 } from "uuid";

import { IBatchBody } from "../interfaces/Interfaces";

type InputType = {
  childProductId: string;
  ThirdPartyAllowed: boolean;
};

class ThirdPartyAllowedService {
  handle = ({ childProductId, ThirdPartyAllowed }: InputType): IBatchBody[] => {
    const headers = {
      "Content-Type": "application/json",
      "Content-Length": "0",
    };
    let config;

    if (ThirdPartyAllowed === true) {
      config = [
        {
          id: String(uuidV4()),
          method: "put",
          url: `/v1/ProductLabels(ProductID=${childProductId}, Name='eBay Fixed')`,
          headers,
        },
        {
          id: String(uuidV4()),
          method: "put",
          url: `/v1/ProductLabels(ProductID=${childProductId}, Name='Incycle.com')`,
          headers,
        },
      ];
    } else {
      config = [
        {
          id: String(uuidV4()),
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
