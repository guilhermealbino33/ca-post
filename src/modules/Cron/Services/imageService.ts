import { v4 as uuidV4 } from "uuid";

import { IBatchBody } from "../interfaces/Interfaces";

type InputType = {
  childProductId: string;
  index: number;
  Images: string[];
};

class ImageService {
  handle = ({ childProductId, Images }: InputType): IBatchBody[] => {
    const config: IBatchBody[] = [];

    Images.map(async (image: string, i: number) => {
      const placementName = `'ITEMIMAGEURL${1 + i}'`;

      const body = {
        id: String(uuidV4()),
        method: "patch",
        url: `/v1/Images(ProductID=${childProductId}, PlacementName=${placementName})`,
        body: {
          Url: `https://images.qbp.com/imageservice/image/${process.env.IMG_CODE}/prodxl/${image}`,
        },
        headers: {
          "Content-Type": "application/json",
        },
      };
      config.push(body);
    });

    return config;
  };
}
export { ImageService };
