import "modules/QBP/models/ProductSchema";
import "modules/QBP/repositories/productRepository";

import { Schema } from "mongoose";

import { IProductInterface } from "../../../modules/QBP/models/ProductInterface";

export interface IQueueAdvisorCategory {
  code: string;
  lastUpdate: number;
  product: IProductInterface;
}

const QueueAdvisorCategory = new Schema<IQueueAdvisorCategory>({
  code: String,
  lastUpdate: Number,
});

QueueAdvisorCategory.virtual("product", {
  ref: "products",
  localField: "code",
  foreignField: "code",
  justOne: true,
});

QueueAdvisorCategory.set("toObject", { virtuals: true });
QueueAdvisorCategory.set("toJSON", { virtuals: true });

export { QueueAdvisorCategory };
