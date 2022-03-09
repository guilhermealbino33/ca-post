import api, { createToken } from "services/api";

class GetProductsBySkuService {
  async handle(skus: string[]) {
    const headers = {
      "Content-Type": "application/json",
    };

    const bodyCodes = {
      requests: skus.map((sku: string, index) => ({
        id: String(index),
        method: "get",
        url: `/v1/products?$filter=Sku eq '${sku}'&$select=ID, Sku, ParentSku`,
      })),
    };

    const codes = await api.post(`/v1/$batch`, JSON.stringify(bodyCodes), {
      headers,
    });

    return codes;
  }
}

export { GetProductsBySkuService };
