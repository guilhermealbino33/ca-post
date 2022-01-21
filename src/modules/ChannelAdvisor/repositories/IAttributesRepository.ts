import { ICreateAttributeDTO } from "../dtos/ICreateAttributeDTO";
import { Attribute } from "../entities/Attribute";

interface IAttributesRepository {
  create(data: ICreateAttributeDTO): Promise<Attribute>;
}

export { IAttributesRepository };
