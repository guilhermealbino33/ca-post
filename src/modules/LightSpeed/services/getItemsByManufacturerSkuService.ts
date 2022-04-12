import api from "services/LightSpeed/api";

class GetItemsByManufacturerSkuService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async handle(manufacturerSku: string, token: any) {
    console.log("manufacturerSku", manufacturerSku);
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    try {
      const item = await api.get(
        `API/V3/Account/${process.env.ACCOUNT_ID}/Item.json?manufacturerSku=${manufacturerSku}`,
        { headers }
      );
      const itemId = item.data?.Item?.itemID;
      if (itemId && itemId !== undefined) {
        return `${itemId}`;
      }
      return "";
    } catch (error) {
      console.log("error");
      return error;
    }
  }
}

export { GetItemsByManufacturerSkuService };
