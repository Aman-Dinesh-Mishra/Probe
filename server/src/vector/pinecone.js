import { Pinecone, } from "@pinecone-database/pinecone";
import { config } from "../config/index.js";
import { logger } from "../utils/logger.js";
export class PineconeClient {
    index;
    constructor() {
        const client = new Pinecone({
            apiKey: config.pineconeApiKey,
        });
        this.index = client.Index(config.pineconeIndex);
        logger.info({
            index: config.pineconeIndex,
        }, "[Pinecone] Client Initialized");
    }
    async upsert(payload) {
        await this.index.upsert({
            records: [
                {
                    id: payload.id,
                    values: payload.values,
                    metadata: payload.metadata,
                },
            ],
        });
        logger.debug({
            id: payload.id,
        }, "[Pinecone] Vector upserted");
    }
    async queryObjects(vector, topK) {
        const result = await this.index.query({
            vector,
            topK,
            includeMetadata: true,
        });
        return {
            matches: (result.matches ?? []).map((match) => ({
                id: match.id ?? "unknown-id",
                score: match.score ?? null,
                metadata: match.metadata ?? null,
            })),
        };
    }
}
