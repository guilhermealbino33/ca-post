import { IProductInterface } from "../../../modules/QBP/models/ProductInterface";

export interface IQueueInterface {
  code: string;
  lastUpdate: number;
  product: IProductInterface;
}
