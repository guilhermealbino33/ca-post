import { IBatchBody } from "../interfaces/Interfaces";

class ImageService {
  handle = (
    childProductId: string,
    index: number,
    Images: string[]
  ): IBatchBody[] => {
    const config: IBatchBody[] = [];

    let count = 0;
    function incrementIndex() {
      // eslint-disable-next-line no-plusplus
      return count++;
    }

    Images.map(async (image: string, i: number) => {
      const placementName = `'ITEMIMAGEURL${1 + i}'`;

      const body = {
        id: `image${incrementIndex() + index}`,
        method: "patch",
        url: `/v1/Images(ProductID=${childProductId}, PlacementName=${placementName})`,
        body: {
          Url: `https://images.qbp.com/imageservice/image/1d59103516e0/prodxl/${image}`,
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
