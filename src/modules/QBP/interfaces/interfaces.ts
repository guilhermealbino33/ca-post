interface IProducts {
  data: {
    ProfileID: string;
    Sku: string;
    Title: string;
    Brand: string;
    Manufacturer: string;
    MPN: string;
    Condition: string;
    Description: string;
    UPC: string;
    BuyItNowPrice: number;
    RetailPrice: number;
    Attributes: [];
  }[];
}
export { IProducts };
