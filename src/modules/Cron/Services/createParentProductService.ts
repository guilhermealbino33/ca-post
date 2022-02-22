import { Request, Response } from "express";
import api from "services/api";
import { utils } from "utils/utils";

class CreateParentProductService {
  handle = async (req: Request, res: Response) => {
    console.log("ENTERED");
    const headers = {
      "Content-Type": "application/json",
    };
    const body = {
      Sku: `PARENT-${req.body.data.model.code}`,
      IsParent: true,
      IsInRelationship: true,
      Brand: req.body.data.brand.name,
      Title: `${req.body.data.brand.name} ${req.body.data.model.name}`,
      Description: req.body.data.model.description,
      ShortDescription: utils.toHtml(req.body.data.model.bulletPoints),
      VaryBy: "Choose Option",
    };
    try {
      await api.post(`/v1/Products`, JSON.stringify(body), {
        headers,
      });
    } catch (e) {
      console.log(e);
    }
    res.status(201).json(body);
  };
}

export { CreateParentProductService };
