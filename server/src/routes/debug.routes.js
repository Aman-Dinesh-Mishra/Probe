import { Router } from "express";
import { DebugService } from "../services/debug.service.js";
import { logger } from "../utils/logger.js";
const router = Router();
const debugService = new DebugService();
router.post("/analyze", async (req, res, next) => {
    try {
        logger.info("[DebugRoutes] Received debug request");
        const result = await debugService.analyze(req.body);
        res.status(200).json({ success: true, data: result });
    }
    catch (error) {
        next(error);
    }
});
export default router;
