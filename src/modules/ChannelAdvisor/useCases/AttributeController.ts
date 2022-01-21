import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreateAttributeUseCase } from "./CreateAttributeUseCase";

class AttributeController {
  async createAttribute(
    request: Request,
    response: Response
  ): Promise<Response> {
    const { value, name, product_id } = request.body;

    const createAttributeUseCase = container.resolve(CreateAttributeUseCase);

    const attribute = await createAttributeUseCase.execute({
      value,
      name,
      product_id,
    });
    return response.status(201).json(attribute);
  }
}

export { AttributeController };
