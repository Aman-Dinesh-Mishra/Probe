import FixAgent from "../agents/fixAgent.js";
import { logger } from "../utils/logger.js";
import type { FixRequest, FixResult } from "../types/api.types.js";

export class FixService {
  private fixAgent: FixAgent;

  constructor() {
    this.fixAgent = new FixAgent();
  }

  async generateFix(request: FixRequest): Promise<FixResult> {
    logger.info(
      {
        errorType: request.analysis.errorType,
        language: request.language,
      },
      "[FixService] Generating fix for err",
    );

    const fix = await this.fixAgent.generateFix({
      originalCode: request.originalCode,
      language: request.language,
      analysis: request.analysis,
      constraints: request.constraints ?? {},
    });

    logger.info(
      {
        confidence: fix.fix.confidence,
      },
      "[FixService] Fix Generated",
    );

    return fix;
  }
}
