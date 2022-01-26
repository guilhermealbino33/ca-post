import { Router } from "express";
import { CronController } from "modules/GoogleCron/cronController";

const cronRoutes = Router();
const cronRoutesController = new CronController();

cronRoutes.post("/", cronRoutesController.cronJob);

export { cronRoutes };
