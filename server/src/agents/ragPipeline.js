import { PineconeClient } from "../vector/pinecone.js";
import { logger } from "../utils/logger.js";
export default class RagPipeline {
    pinecone;
    constructor() {
        this.pinecone = new PineconeClient();
    }
    async retrieve(errorMsg, codeSnippet) {
        logger.debug("[RagPipeline] Bypassing vector embedding retrieval");
        return [];
    }
    async store(payload) {
        logger.debug("[RagPipeline] Bypassing vector embedding storage");
    }
}
