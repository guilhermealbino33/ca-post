import api from "services/ChannelAdvisor/api";

class GetItemsByManufacturerSkuService {
  async handle(sku: string) {
    const codes = await api.get(
      `API/V3/Account/${process.env.ACCOUNT_ID}/Item.json?manufacturerSku=${sku}`
    );
    console.log("codes", codes);
    return codes;
  }
}

export { GetItemsByManufacturerSkuService };
