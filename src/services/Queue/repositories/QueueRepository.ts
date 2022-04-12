import mongoose from "mongoose";

import { CategoryQueue } from "../models/CategoryQueue";
import { ImageQueue } from "../models/ImageQueue";
import { LabelQueue } from "../models/LabelQueue";
import { ProductQueue } from "../models/ProductQueue";

const ProductQueueRepository = mongoose.model("ProductQueue", ProductQueue);
const ImageQueueRepository = mongoose.model("ImageQueue", ImageQueue);
const LabelQueueRepository = mongoose.model("LabelQueue", LabelQueue);
const CategoryQueueRepository = mongoose.model("CategoryQueue", CategoryQueue);

export {
  ProductQueueRepository,
  ImageQueueRepository,
  LabelQueueRepository,
  CategoryQueueRepository,
};
