import mongoose from "mongoose";

import { QueueAdvisorImageUpdate } from "../models/QueueAdvisorImageUpdate";
import { QueueAdvisorLabel } from "../models/QueueAdvisorLabel";
import { QueueAdvisorUpdate } from "../models/QueueAdvisorUpdate";

const QueueAdvisorUpdateRepository = mongoose.model(
  "queueAdvisorUpdate",
  QueueAdvisorUpdate
);
const QueueAdvisorImageUpdateRepository = mongoose.model(
  "queueAdvisorImageUpdate",
  QueueAdvisorImageUpdate
);
const QueueAdvisorLabelRepository = mongoose.model(
  "QueueAdvisorLabel",
  QueueAdvisorLabel
);

export {
  QueueAdvisorUpdateRepository,
  QueueAdvisorImageUpdateRepository,
  QueueAdvisorLabelRepository,
};
