import { IProductInterface } from "../../../modules/QBP/models/ProductInterface";

export interface IQueueAdvisor {
  code: string;
  lastUpdate: number;
  product: IProductInterface;
}
