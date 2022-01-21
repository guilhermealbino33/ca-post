import { Repository, getRepository } from "typeorm";

import { ICreateProductDTO } from "../dtos/ICreateProductDTO";
import { Product } from "../entities/Product";
import { IProductsRepository } from "./IProductsRepository";

class ProductsRepository implements IProductsRepository {
  private repository: Repository<Product>;

  constructor() {
    this.repository = getRepository(Product);
  }
  async create({
    profile_id,
    sku,
    title,
    brand,
    manufacturer,
    mpn,
    condition,
    description,
    upc,
    buy_it_now_price,
    retail_price,
  }: ICreateProductDTO): Promise<Product> {
    const product = this.repository.create({
      profile_id,
      sku,
      title,
      brand,
      manufacturer,
      mpn,
      condition,
      description,
      upc,
      buy_it_now_price,
      retail_price,
    });
    await this.repository.save(product);
    return product;
  }
}

export { ProductsRepository };
