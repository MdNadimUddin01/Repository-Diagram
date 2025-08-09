import { Router } from "express"
import { generateMermaidCode } from "../controller/flowChart.contoller.js";
const router = Router();

router.route("/flowChartCode").post(generateMermaidCode);

export default router;