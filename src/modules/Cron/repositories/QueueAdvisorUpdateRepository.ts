import mongoose from "mongoose";

import { QueueAdvisorImageUpdate } from "../models/QueueAdvisorImageUpdate";
import { QueueAdvisorUpdate } from "../models/QueueAdvisorUpdate";

const QueueAdvisorUpdateRepository = mongoose.model(
  "queueAdvisorUpdate",
  QueueAdvisorUpdate
);
const QueueAdvisorImageUpdateRepository = mongoose.model(
  "queueAdvisorImageUpdate",
  QueueAdvisorImageUpdate
);

export { QueueAdvisorUpdateRepository, QueueAdvisorImageUpdateRepository };
