import mongoose from "mongoose";

import { QueueAdvisorUpdate } from "../models/QueueAdvisorUpdate";

const QueueAdvisorUpdateRepository = mongoose.model(
  "queueAdvisorUpdate",
  QueueAdvisorUpdate
);

export { QueueAdvisorUpdateRepository };
