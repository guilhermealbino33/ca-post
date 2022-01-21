import { Router } from "express";

import { externalChannelRoutes } from "./externalChannelAdvisor.routes";
import { qbpRoutes } from "./qbp.routes";

const router = Router();

router.use("/qbp", qbpRoutes);
router.use("/channel", externalChannelRoutes);

export { router };
