import { Request, Response } from "express";

import productDB from "../../../data/product.json";
// import { exportToCsv } from "../../../services/exportToCsv";
import { product } from "../repositories/productRepository";
// import { IProducts } from "../types/types";

const { productsDB: productMock } = productDB;

class ProductController {
  details = async (req: Request, res: Response) => {
    return product
      .findOne({ code: req.params.code })
      .then((response) => res.send(response));
  };

  listProducts = (req: Request, res: Response) => {
    return res.status(200).json(productDB);
  };

  translateDetails = async (req: Request, res: Response) => {
    let str = req.body.data.name;
    const modelStr = req.body.data.model.name;
    const brandStr = req.body.data.brand.name;
    str = str.replace(modelStr, "", brandStr, "");

    productMock.data.push({
      ProfileID: req.body.code,
      Sku: req.body.data.manufacturerPartNumber,
      Title: str,
      Brand: req.body.data.brand.name,
      Manufacturer: req.body.Manufacturer,
      MPN: req.body.data.manufacturerPartNumber,
      Condition: "new",
      Description: req.body.data.model.bulletPoints,
      UPC: req.body.data.barcodes,
      BuyItNowPrice: req.body.data.basePrice,
      RetailPrice: req.body.data.mapPrice,
      Attributes: req.body.data.productAttributes,
    });
    res.status(201).json(productMock);
  };
}
export { ProductController };
