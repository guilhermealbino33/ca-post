interface ICreateProductDTO {
  profile_id: string;
  sku: string;
  title: string;
  brand: string;
  manufacturer: string;
  mpn: string;
  condition: string;
  description: string;
  upc: string;
  buy_it_now_price: number;
  retail_price: number;
}

export { ICreateProductDTO };
