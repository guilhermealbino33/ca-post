import { ICreateProductDTO } from "../dtos/ICreateProductDTO";
import { Product } from "../entities/Product";

interface IProductsRepository {
  create(data: ICreateProductDTO): Promise<Product>;
}

export { IProductsRepository };
