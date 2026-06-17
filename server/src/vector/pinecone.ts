import {
  Pinecone,
  type Index,
  type RecordMetadata,
} from "@pinecone-database/pinecone";

import {config}  from "../config/index.js";
import { logger } from "../utils/logger.js";

interface UpsertPayload {
  id: string;
  values: number[];
  metadata: RecordMetadata;   
}

interface QueryResult {
  matches: Array<{
    id: string;
    score: number | null;
    metadata: RecordMetadata | null;  
  }>;
}

export class PineconeClient {
  private index: Index<RecordMetadata>;

  constructor() {
    const client = new Pinecone({
      apiKey: config.pineconeApiKey,
    });

    this.index = client.Index(config.pineconeIndex);

    logger.info({
      index: config.pineconeIndex,
    },"[Pinecone] Client Initialized");
  }

  async upsert(payload: UpsertPayload): Promise<void> {
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
    },"[Pinecone] Vector upserted");
  }

  async queryObjects(
    vector: number[],
    topK: number
  ): Promise<QueryResult> {
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
