import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import ValidationService from "../services/validation.service.js";

const router = Router();
const validationService = new ValidationService();

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await validationService.validateFix(req.body);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    console.error("[Validation Route Error]", error);

    res.status(500).json({
      success: false,
      message: error?.message || "Internal server error",
    });
  }
});

export default router;
