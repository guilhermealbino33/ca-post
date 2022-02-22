import { Request, Response } from "express";
import api from "services/api";
import { utils } from "utils/utils";

class ProductController {
  handle = async (req: Request, res: Response) => {
    const headers = {
      "Content-Type": "application/json",
    };
    const data = {
      Sku: `PARENT-${req.body.data.model.code}`,
      IsParent: true,
      IsInRelationship: true,
      Title: utils.prettyName(
        req.body.data.name,
        req.body.data.model.name,
        req.body.data.brand.name
      ),
      Description: utils.toHtml(req.body.data.model.bulletPoints),
    };
    try {
      await api.post(`/v1/Products`, JSON.stringify(data), {
        headers,
      });
    } catch (e) {
      console.log(e);
    }
    res.status(201).json(data);
  };
}

export { ProductController };
