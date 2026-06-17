import { OpenAI } from "openai";
import { config } from "../config/index.js";
import { logger } from "../utils/logger.js";
import type { DebugAgentInput, DebugResult } from "../types/debug.types.js";

export default class DebugAgent {
  private client: OpenAI;
  private readonly model = "llama-3.1-8b-instant";

  constructor() {
    this.client = new OpenAI({
      apiKey: config.openApiKey,
      baseURL: "https://api.groq.com/openai/v1",
    });
  }

  async analyze(input: DebugAgentInput & { language: string }): Promise<DebugResult> {
    const systemPrompt = `You are an expert software debugger. 
Analyze the provided error, code, and context specifically for the ${input.language} programming language.
Return ONLY valid JSON matching the schema:
{
  "rootCause": string,
  "errorType": string,
  "severity": "low" | "medium" | "high" | "critical",
  "affectedLines": number[],
  "explanation": string,
  "suggestedApproach": string
}`;

    const userPrompt = `LANGUAGE: ${input.language}
ERR: ${JSON.stringify(input.parsedError, null, 2)}
CODE:
\`\`\`
${input.originalCode}
\`\`\`
SIMILAR CASES: ${JSON.stringify(input.context, null, 2)}
RUNTIME INFO: ${JSON.stringify(input.runtimeInfo, null, 2)}`;

    logger.debug("[DebugAgent] Calling LLM");

    const response = await this.client.chat.completions.create({
      model: this.model,
      temperature: 0.1,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    const raw = response.choices[0]?.message?.content ?? "{}";
    return JSON.parse(raw) as DebugResult;
  }
}