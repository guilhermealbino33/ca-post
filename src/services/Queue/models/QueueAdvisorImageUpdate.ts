import "modules/QBP/models/ProductSchema";
import "modules/QBP/repositories/productRepository";

import { IProductInterface } from "modules/QBP/models/ProductInterface";
import { Schema } from "mongoose";

export interface IQueueAdvisorUpdate {
  code: string;
  lastUpdate: number;
  product: IProductInterface;
}

const QueueAdvisorImageUpdate = new Schema<IQueueAdvisorUpdate>({
  code: String,
  lastUpdate: Number,
});

QueueAdvisorImageUpdate.virtual("product", {
  ref: "products",
  localField: "code",
  foreignField: "code",
  justOne: true,
});

QueueAdvisorImageUpdate.set("toObject", { virtuals: true });
QueueAdvisorImageUpdate.set("toJSON", { virtuals: true });

export { QueueAdvisorImageUpdate };
