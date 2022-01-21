import { Request, Response } from "express";

import { product } from "../repositories/productRepository";

class ProductController {
  details = async (req: Request, res: Response) => {
    return product
      .findOne({ code: req.params.code })
      .then((response) => res.send(response));
  };

}
export { ProductController };
