import "modules/QBP/models/ProductSchema";
import "modules/QBP/repositories/productRepository";

import { Schema } from "mongoose";

import { IProductInterface } from "../../../modules/QBP/models/ProductInterface";

export interface IQueueAdvisorLabel {
  code: string;
  lastUpdate: number;
  product: IProductInterface;
}

const QueueAdvisorLabel = new Schema<IQueueAdvisorLabel>({
  code: String,
  lastUpdate: Number,
});

QueueAdvisorLabel.virtual("product", {
  ref: "products",
  localField: "code",
  foreignField: "code",
  justOne: true,
});

QueueAdvisorLabel.set("toObject", { virtuals: true });
QueueAdvisorLabel.set("toJSON", { virtuals: true });

export { QueueAdvisorLabel };
