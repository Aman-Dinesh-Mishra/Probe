import type { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger.js";

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
}

export default function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const status = err.statusCode ?? 500;
  logger.error({ message: err.message, code: err.code, stack: err.stack });
  res.status(status).json({
    error: { message: err.message, code: err.code ?? "INTERNAL_ERROR" },
  });
}
