import "modules/QBP/models/ProductSchema";
import "modules/QBP/repositories/productRepository";

import { Schema } from "mongoose";

import { IQueueInterface } from "../interfaces/interfaces";

const ImageQueue = new Schema<IQueueInterface>({
  code: String,
  lastUpdate: Number,
});

ImageQueue.virtual("product", {
  ref: "products",
  localField: "code",
  foreignField: "code",
  justOne: true,
});

ImageQueue.set("toObject", { virtuals: true });
ImageQueue.set("toJSON", { virtuals: true });

export { ImageQueue };
