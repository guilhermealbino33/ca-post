import "modules/QBP/models/ProductSchema";
import "modules/QBP/repositories/productRepository";

import { Schema } from "mongoose";

import { IQueueAdvisor } from "../interfaces/interfaces";

const QueueAdvisorLabel = new Schema<IQueueAdvisor>({
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
