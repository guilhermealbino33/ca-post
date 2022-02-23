import { Request, Response } from "express";
import api from "services/api";
import { utils } from "utils/utils";

class CreateChildProductService {
  handle = async (req: Request, res: Response) => {
    console.log("ENTERED");
    const headers = {
      "Content-Type": "application/json",
    };
    const data = {
      Sku: req.body.data.manufacturerPartNumber,
      ParentProductID: req.body.data.ProductID,
      IsParent: false,
      IsInRelationship: true,
      Title: `${req.body.data.brand.name} ${req.body.data.model.name}`,
      Description: req.body.data.model.description,
      ShortDescription: utils.toHtml(req.body.data.model.bulletPoints),
      VaryBy: "Choose Option",
      Attributes: [
        {
          Name: "QBP Code",
          Value: req.body.data.code,
        },
        {
          Name: "QBP Name",
          Value: utils.removeDuplicateCharacters(
            utils.prettyName(
              req.body.data.name,
              req.body.data.model.name,
              req.body.data.brand.name
            )
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
      data.Attributes.push(attribute);
    });
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

export { CreateChildProductService };
