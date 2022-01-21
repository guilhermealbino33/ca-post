import { inject, injectable } from "tsyringe";

import { Attribute } from "../entities/Attribute";
import { IAttribute } from "../interfaces/Interfaces";
import { IAttributesRepository } from "../repositories/IAttributesRepository";

@injectable()
class CreateAttributeUseCase {
  constructor(
    @inject("AttributesRepository")
    private attributesRepository: IAttributesRepository
  ) {}

  async execute({ value, name, product_id }: IAttribute): Promise<Attribute> {
    const attribute = this.attributesRepository.create({
      value,
      name,
      product_id,
    });

    return attribute;
  }
}

export { CreateAttributeUseCase };
