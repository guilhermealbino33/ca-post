import { Request, Response } from "express";
import { product } from "modules/QBP/repositories/productRepository";
import api from "services/api";
import { utils } from "utils/utils";

class cronController {
  codes = [
    "RM0020",
    "RM0021",
    "RM0028",
    "RM0030",
    "RM0040",
    "RM0050",
    "RM0051",
    "RM0060",
    "RM0153",
    "RM0154",
    "RM0155",
  ];

  details = async (req: Request, res: Response) => {
    this.codes.forEach(async (code: string, i: number) => {
      const response = await product.findOne({ code: code[i] });
      return res.send(response);
    });
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
}

export { cronController };
