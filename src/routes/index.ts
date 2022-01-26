import { Router } from "express";

import { cronRoutes } from "./cron.routes";
import { externalChannelRoutes } from "./externalChannelAdvisor.routes";
import { qbpRoutes } from "./qbp.routes";

const router = Router();

router.use("/qbp", qbpRoutes);
router.use("/channel", externalChannelRoutes);
router.use("/cron", cronRoutes);

export { router };
