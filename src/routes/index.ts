import { Router } from "express";

import { channelRoutes } from "./channeladvisor.routes";
import { externalChannelRoutes } from "./externalChannelAdvisor.routes";
import { qbpRoutes } from "./qbp.routes";

const router = Router();

router.use("/qbp", qbpRoutes);
router.use("/channel", channelRoutes);
router.use("/external", externalChannelRoutes);

export { router };
