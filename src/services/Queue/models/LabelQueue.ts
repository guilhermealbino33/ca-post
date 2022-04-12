import "modules/QBP/models/ProductSchema";
import "modules/QBP/repositories/productRepository";

import { Schema } from "mongoose";

import { IQueueInterface } from "../interfaces/interfaces";

const LabelQueue = new Schema<IQueueInterface>({
  code: String,
  lastUpdate: Number,
});

LabelQueue.virtual("product", {
  ref: "products",
  localField: "code",
  foreignField: "code",
  justOne: true,
});

LabelQueue.set("toObject", { virtuals: true });
LabelQueue.set("toJSON", { virtuals: true });

export { LabelQueue };
