import { Schema } from "mongoose";

export interface IQueueAdvisorUpdate {
  code: string;
  lastUpdate: number;
}

const QueueAdvisorUpdate = new Schema<IQueueAdvisorUpdate>({
  code: String,
  lastUpdate: Number,
});

export { QueueAdvisorUpdate };
