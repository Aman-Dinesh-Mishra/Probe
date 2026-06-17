import { logger } from "../utils/logger.js";
export default function errorHandler(err, req, res, _next) {
    const status = err.statusCode ?? 500;
    logger.error({ message: err.message, code: err.code, stack: err.stack });
    res.status(status).json({
        error: { message: err.message, code: err.code ?? "INTERNAL_ERROR" },
    });
}
