import mongoose from "mongoose";

import { QueueAdvisorCreate } from "../models/QueueAdvisorCreate";
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
const QueueAdvisorCreateRepository = mongoose.model(
  "queueAdvisorCreate",
  QueueAdvisorCreate
);

export {
  QueueAdvisorUpdateRepository,
  QueueAdvisorImageUpdateRepository,
  QueueAdvisorCreateRepository,
};
