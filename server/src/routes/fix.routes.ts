import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import FixAgent from "../agents/fixAgent.js";
import { logger } from "../utils/logger.js";

const router = Router();
const fixAgent = new FixAgent();

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.info("[FixRoutes] Received fix request");
    const result = await fixAgent.generateFix(req.body);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

export default router;
