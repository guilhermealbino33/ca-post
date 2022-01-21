import { Request, Response } from "express";

import api from "../../services/api";

class ExternalChannelAdvisorController {
  list = async (req: Request, res: Response) => {
    let dataResp;
    async function products() {
      return api.get("/v1/products");
    }
    // eslint-disable-next-line prefer-const
    dataResp = products();
    dataResp
      .then((response) => {
        res.status(201).json(response.data);
      })
      .catch((error) => {
        res.status(400).json(error);
      });
  };

  single = async (req: Request, res: Response) => {
    const { code } = req.params;

    try {
      const response = await api.get(`/v1/products(${code})`);
      res.status(201).json(response.data);
    } catch (error) {
      res.status(400).json(error);
    }
  };

  createProduct = async (req: Request, res: Response) => {
    const data = {
      ProfileID: req.body.ProfileID,
      Sku: req.body.Sku,
      Title: req.body.tittle,
      Brand: req.body.Brand,
      Manufacturer: req.body.Manufacturer,
      MPN: req.body.MPN,
      Condition: req.body.Condition,
      Description: req.body.Description,
      UPC: req.body.UPC,
      BuyItNowPrice: req.body.BuyItNowPrice,
      RetailPrice: req.body.RetailPrice,
      Attributes: req.body.Attributes,
    };

    try {
      const response = await api.post("/v1/products", data);
      res.status(201).json(response.data);
    } catch (error) {
      res.status(400).json(error);
    }
  };
  updateProduct = async (req: Request, res: Response) => {
    const { code } = req.params;
    let nameStr = req.body.data.name;
    const modelStr = req.body.data.model.name;
    const brandStr = req.body.data.brand.name;
    const model = `${brandStr} ${modelStr}`;
    nameStr = nameStr.replace(modelStr, "");
    nameStr = nameStr.replace(brandStr, "");

    let descriptionStr = req.body.data.model.bulletPoints;
    descriptionStr = descriptionStr.join("- ");
    descriptionStr = `<ul><li>${descriptionStr.replace(
      "- ",
      "</li><li>"
    )}</li></ul>`;

    const data = {
      Value: {
        Attributes: [
          {
            Name: "QBP Code",
            Value: req.body.code,
          },
          {
            Name: "QBP Name",
            Value: nameStr.trim(),
          },
          {
            Name: "QBP Model",
            Value: model,
          },
          {
            Name: "QBP Description",
            Value: req.body.data.model.description,
          },
          {
            Name: "QBP Short Description",
            Value: descriptionStr,
          },
          {
            Name: "QBP Cost",
            Value: JSON.stringify(req.body.data.basePrice),
          },
          {
            Name: "QBP MAP",
            Value: JSON.stringify(req.body.data.mapPrice),
          },
          {
            Name: "QBP MSRP",
            Value: JSON.stringify(req.body.data.msrp),
          },
          {
            Name: "QBP Brand",
            Value: brandStr,
          },
          {
            Name: "QBP Discontinued",
            Value: JSON.stringify(req.body.data.discontinued),
          },
          {
            Name: "QBP Thirdpartyallowed",
            Value: JSON.stringify(req.body.data.thirdPartyAllowed),
          },
        ],
      },
    };

    type IAttribQBP = {
      name: string;
      value: string;
    };

    req.body.data.productAttributes.forEach((attrib: IAttribQBP, i: number) => {
      const attribute = {
        Name: `Metafield${1 + i}`,
        Value: `• ${attrib.name}: ${attrib.value}`,
      };
      data.Value.Attributes.push(attribute);
    });

    try {
      const response = await api.post(
        `/v1/Products(${code})/UpdateAttributes`,
        data
      );
      res.status(201).json(response.data);
    } catch (error) {
      res.status(400).json(error);
    }
  };
}
export { ExternalChannelAdvisorController };
