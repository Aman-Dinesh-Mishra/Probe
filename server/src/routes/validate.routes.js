import { Router } from "express";
import ValidationService from "../services/validation.service.js";
const router = Router();
const validationService = new ValidationService();
router.post("/", async (req, res, next) => {
    if (process.env.ENABLE_VALIDATION !== "true") {
        return res.status(503).json({
            success: false,
            message: "Validation is disabled in cloud deployment.",
        });
    }
    try {
        const result = await validationService.validateFix(req.body);
        res.status(200).json({ success: true, data: result });
    }
    catch (error) {
        console.error("[Validation Route Error]", error);
        res.status(500).json({
            success: false,
            message: error?.message || "Internal server error",
        });
    }
});
router.post("/", async (req, res, next) => {
    try {
        const result = await validationService.validateFix(req.body);
        res.status(200).json({ success: true, data: result });
    }
    catch (error) {
        console.error("[Validation Route Error]", error);
        res.status(500).json({
            success: false,
            message: error?.message || "Internal server error",
        });
    }
});
export default router;
