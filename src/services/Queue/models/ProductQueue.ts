import "modules/QBP/models/ProductSchema";
import "modules/QBP/repositories/productRepository";

import { Schema } from "mongoose";

import { IQueueInterface } from "../interfaces/interfaces";

const ProductQueue = new Schema<IQueueInterface>({
  code: String,
  lastUpdate: Number,
});

ProductQueue.virtual("product", {
  ref: "products",
  localField: "code",
  foreignField: "code",
  justOne: true,
});

ProductQueue.set("toObject", { virtuals: true });
ProductQueue.set("toJSON", { virtuals: true });

export { ProductQueue };
