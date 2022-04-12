import "modules/QBP/models/ProductSchema";
import "modules/QBP/repositories/productRepository";

import { Schema } from "mongoose";

import { IQueueInterface } from "../interfaces/interfaces";

const CategoryQueue = new Schema<IQueueInterface>({
  code: String,
  lastUpdate: Number,
});

CategoryQueue.virtual("product", {
  ref: "products",
  localField: "code",
  foreignField: "code",
  justOne: true,
});

CategoryQueue.set("toObject", { virtuals: true });
CategoryQueue.set("toJSON", { virtuals: true });

export { CategoryQueue };
