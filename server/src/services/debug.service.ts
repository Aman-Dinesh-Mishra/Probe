import DebugAgent from "../agents/debugAgent.js";
import RagPipeline from "../agents/ragPipeline.js";
import { logger } from "../utils/logger.js";
import type { DebugRequest } from "../types/api.types.js";
import type { DebugResult } from "../types/debug.types.js";

export class DebugService {
  private agent: DebugAgent;
  private rag: RagPipeline;

  constructor() {
    this.agent = new DebugAgent();
    this.rag = new RagPipeline();
  }

  async analyze(request: DebugRequest): Promise<DebugResult> {
    logger.info("[DebugService] Starting analysis");

    const ragContext = await this.rag.retrieve(
      request.errorPayload.message,
      request.codeSnippet,
    );

    logger.debug(
      {
        matches: ragContext.length,
      },
      "[DebugService] Retrieved RAG context",
    );

    const result = await this.agent.analyze({
      language: request.language ?? "typescript",

      parsedError: {
        message: request.errorPayload.message,
        name: request.errorPayload.name ?? "Error",
        stack: request.errorPayload.stack ?? "",
        isAsync: false,
        isTypeError: request.errorPayload.name === "TypeError",
      },

      context: ragContext,

      runtimeInfo: {
        asyncPatterns: [],
        unhandledRejections: [],
        potentialNullDerefs: [],
        memoryWarnings: [],
        errorLineContext: "",
      },

      originalCode: request.codeSnippet,
    });

    logger.info(
      {
        errorType: result.errorType,
        severity: result.severity,
      },
      "[DebugService] Analysis complete",
    );

    await this.rag.store({
      errorMsg: request.errorPayload.message,
      codeSnippet: request.codeSnippet,
      rootCause: result.rootCause,
      solution: result.suggestedApproach,
    });

    return result;
  }
}
