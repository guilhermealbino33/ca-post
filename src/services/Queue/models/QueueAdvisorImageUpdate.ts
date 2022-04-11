import "modules/QBP/models/ProductSchema";
import "modules/QBP/repositories/productRepository";

import { Schema } from "mongoose";

import { IQueueAdvisor } from "../interfaces/interfaces";

const QueueAdvisorImageUpdate = new Schema<IQueueAdvisor>({
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
