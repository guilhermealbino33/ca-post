import { IProductInterface } from "modules/QBP/models/ProductInterface";
import { Schema } from "mongoose";

export interface IQueueAdvisorUpdate {
  code: string;
  lastUpdate: number;
  product: IProductInterface;
}

const QueueAdvisorUpdate = new Schema<IQueueAdvisorUpdate>({
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
