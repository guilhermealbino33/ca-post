import "modules/QBP/models/ProductSchema";
import "modules/QBP/repositories/productRepository";

import { IProductInterface } from "modules/QBP/models/ProductInterface";
import { Schema } from "mongoose";

export interface IQueueAdvisorCreate {
  code: string;
  lastUpdate: number;
  product: IProductInterface;
}

const QueueAdvisorCreate = new Schema<IQueueAdvisorCreate>({
  code: String,
  lastUpdate: Number,
});

QueueAdvisorCreate.virtual("product", {
  ref: "products",
  localField: "code",
  foreignField: "code",
  justOne: true,
});

QueueAdvisorCreate.set("toObject", { virtuals: true });
QueueAdvisorCreate.set("toJSON", { virtuals: true });

export { QueueAdvisorCreate };
