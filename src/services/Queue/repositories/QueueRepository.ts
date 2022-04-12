import mongoose from "mongoose";

import { CategoryQueue } from "../models/CategoryQueue";
import { ImageQueue } from "../models/ImageQueue";
import { LabelQueue } from "../models/LabelQueue";
import { ProductQueue } from "../models/ProductQueue";

const ProductQueueRepository = mongoose.model(
  "queueAdvisorUpdate",
  ProductQueue
);
const ImageQueueRepository = mongoose.model(
  "queueAdvisorImageUpdate",
  ImageQueue
);
const LabelQueueRepository = mongoose.model("QueueAdvisorLabel", LabelQueue);
const CategoryQueueRepository = mongoose.model(
  "QueueAdvisorCategory",
  CategoryQueue
);

export {
  ProductQueueRepository,
  ImageQueueRepository,
  LabelQueueRepository,
  CategoryQueueRepository,
};
