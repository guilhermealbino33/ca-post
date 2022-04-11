import "modules/QBP/models/ProductSchema";
import "modules/QBP/repositories/productRepository";

import { Schema } from "mongoose";

import { IQueueAdvisor } from "../interfaces/interfaces";

const QueueAdvisorCategory = new Schema<IQueueAdvisor>({
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
