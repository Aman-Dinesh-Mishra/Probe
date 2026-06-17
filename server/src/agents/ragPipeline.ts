import { PineconeClient } from "../vector/pinecone.js";
import { logger } from "../utils/logger.js";
import type { RagContext } from "../types/debug.types.js";

export default class RagPipeline {
  private pinecone: PineconeClient;

  constructor() {
    this.pinecone = new PineconeClient();
  }

  async retrieve(errorMsg: string, codeSnippet: string): Promise<RagContext[]> {
    logger.debug("[RagPipeline] Bypassing vector embedding retrieval");
    return [];
  }

  async store(payload: {
    errorMsg: string;
    codeSnippet: string;
    rootCause: string;
    solution: string;
  }): Promise<void> {
    logger.debug("[RagPipeline] Bypassing vector embedding storage");
  }
}
