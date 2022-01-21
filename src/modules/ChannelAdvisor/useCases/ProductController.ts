import { Request, Response } from "express";
import { container } from "tsyringe";
// import { Attribute } from "../entities/Attribute";

import { CreateProductUseCase } from "./CreateProductUseCase";

class ProductController {
  async createProduct(request: Request, response: Response): Promise<Response> {
    const {
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
    } = request.body;

    const createProductUseCase = container.resolve(CreateProductUseCase);

    const product = await createProductUseCase.execute({
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
    });
    return response.status(201).json(product);
  }
}

export { ProductController };
