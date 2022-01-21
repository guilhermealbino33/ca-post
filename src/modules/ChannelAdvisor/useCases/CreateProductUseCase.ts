import {
  IAttribute,
  IProduct,
} from "modules/ChannelAdvisor/interfaces/Interfaces";
import { inject, injectable } from "tsyringe";

import { IAttributesRepository } from "../repositories/IAttributesRepository";
import { IProductsRepository } from "../repositories/IProductsRepository";

@injectable()
class CreateProductUseCase {
  constructor(
    @inject("ProductsRepository")
    private productsRepository: IProductsRepository,
    @inject("AttributesRepository")
    private attributesRepository: IAttributesRepository
  ) {}

  async execute({
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
    attributes,
  }: IProduct): Promise<IProduct> {
    const product = await this.productsRepository.create({
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

    if (attributes.length > 0) {
      attributes.forEach(async (attribute: IAttribute) => {
        await this.attributesRepository.create({
          ...attribute,
          product_id: product.profile_id,
        });
      });
    }
    const productResponse: IProduct = {
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
      attributes,
    };

    return productResponse;
  }
}

export { CreateProductUseCase };
