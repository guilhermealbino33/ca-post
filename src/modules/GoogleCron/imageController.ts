import { Request, Response } from "express";
import api from "services/api";

class ImageController {
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

  images = async (req: Request, res: Response) => {
    this.codes.forEach(async (code) => {
      const { images } = req.params; // ver como pegar a lista de imagens

      try {
        const response = await api.patch(
          `/v1/Products(${code})/Images('${images}')`,
          req.body
        );
        res.status(201).json(response.data);
      } catch (error) {
        res.status(400).json(error);
      }
    });
  };
}

export { ImageController };
