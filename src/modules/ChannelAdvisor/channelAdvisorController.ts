import { Request, Response } from "express";
import { utils } from "utils/utils";

import api from "../../services/api";

class ChannelAdvisorController {
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

    const data = {
      Value: {
        Attributes: [
          {
            Name: "QBP Code",
            Value: req.body.code,
          },
          {
            Name: "QBP Name",
            Value: utils.prettyName(
              req.body.data.name,
              req.body.data.model.name,
              req.body.data.brand.name
            ),
          },
          {
            Name: "QBP Model",
            Value: `${req.body.data.brand.name} ${req.body.data.model.name}`,
          },
          {
            Name: "QBP Description",
            Value: req.body.data.model.description,
          },
          {
            Name: "QBP Short Description",
            Value: utils.toHtml(req.body.data.model.bulletPoints),
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
            Value: req.body.data.brand.name,
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

  productImages = async (req: Request, res: Response) => {
    const { code } = req.params;
    const { images } = req.params;

    try {
      const response = await api.patch(
        `/v1/Products(${code})/Images('${images}')`,
        req.body
      );
      res.status(201).json(response.data);
    } catch (error) {
      res.status(400).json(error);
    }
  };
}
export { ChannelAdvisorController };
