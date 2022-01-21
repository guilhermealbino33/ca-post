import { getRepository, Repository } from "typeorm";

import { ICreateAttributeDTO } from "../dtos/ICreateAttributeDTO";
import { Attribute } from "../entities/Attribute";
import { IAttributesRepository } from "./IAttributesRepository";

class AttributesRepository implements IAttributesRepository {
  private repository: Repository<Attribute>;

  constructor() {
    this.repository = getRepository(Attribute);
  }
  async create({
    value,
    name,
    product_id,
  }: ICreateAttributeDTO): Promise<Attribute> {
    const attribute = this.repository.create({
      value,
      name,
      product_id,
    });
    await this.repository.save(attribute);
    return attribute;
  }
}

export { AttributesRepository };
