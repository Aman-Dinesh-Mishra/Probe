import OpenAI from "openai";
import { config } from "../config/index.js";
import type { DebugResult } from "../types/debug.types.js";

export class AnalyzerAgent {
  private client: OpenAI;
  private readonly model = "llama-3.1-8b-instant";

  constructor() {
    this.client = new OpenAI({
      apiKey: config.openApiKey,
      baseURL: config.openAiBaseUrl,
    });
  }

  async analyze(code: string, language: string): Promise<DebugResult> {
    const systemPrompt = `You are a senior software engineer performing code analysis.
Analyse the provided code & identify constraints.
Respond ONLY as valid JSON matching this shape:
{
  "rootCause": "detailed explanation",
  "errorType": "one sentence description",
  "affectedLines" : [1,2],
  "severity": "high",
  "explanation": "expanded reasoning",
  "suggestedApproach": "recommended fix"
}`;

    const userPrompt = `Language: ${language}\nCode to Analyze:\n\`\`\`\n${code}\n\`\`\``;

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
    try {
      return JSON.parse(raw) as DebugResult;
    } catch (error) {
      throw new Error("[AnalyzerAgent] Returned malformed JSON");
    }
  }
}
