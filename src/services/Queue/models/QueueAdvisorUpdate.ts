import "modules/QBP/models/ProductSchema";
import "modules/QBP/repositories/productRepository";

import { Schema } from "mongoose";

import { IProductInterface } from "../../../modules/QBP/models/ProductInterface";

export interface IQueueAdvisorUpdate {
  code: string;
  lastUpdate: number;
  product: IProductInterface;
}

const QueueAdvisorUpdate = new Schema<IQueueAdvisorUpdate>({
  code: String,
  lastUpdate: Number,
});

QueueAdvisorUpdate.virtual("product", {
  ref: "products",
  localField: "code",
  foreignField: "code",
  justOne: true,
});

QueueAdvisorUpdate.set("toObject", { virtuals: true });
QueueAdvisorUpdate.set("toJSON", { virtuals: true });

export { QueueAdvisorUpdate };
