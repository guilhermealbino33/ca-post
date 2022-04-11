import "modules/QBP/models/ProductSchema";
import "modules/QBP/repositories/productRepository";

import { Schema } from "mongoose";

import { IQueueAdvisor } from "../interfaces/interfaces";

const QueueAdvisorUpdate = new Schema<IQueueAdvisor>({
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
