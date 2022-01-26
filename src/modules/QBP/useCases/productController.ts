import { Request, Response } from "express";

import { ProductRepository } from "../repositories/productRepository";

class ProductController {
  details = async (req: Request, res: Response) => {
    return ProductRepository.findOne({ code: req.params.code }).then(
      (response) => res.send(response)
    );
  };
}
export { ProductController };
