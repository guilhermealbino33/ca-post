import { Router } from "express";

import { channelRoutes } from "./channelAdvisor.routes";
import { cronRoutes } from "./cron.routes";
import { lightSpeedRoutes } from "./lightspeed.routes";
import { qbpRoutes } from "./qbp.routes";

const router = Router();

router.use("/qbp", qbpRoutes);
router.use("/channel", channelRoutes);
router.use("/cron", cronRoutes);
router.use("/lightspeed", lightSpeedRoutes);

export { router };
