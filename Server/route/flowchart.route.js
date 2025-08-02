import { Router } from "express"
import { flowChartHandler } from "../controller/flowchart.controller.js";
const router = Router();

router.route("/flowChartCode").post(flowChartHandler);

export default router;