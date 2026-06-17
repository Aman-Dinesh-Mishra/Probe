import OpenAI from "openai";
import { config } from "../config/index.js";
import { logger } from "../utils/logger.js";
export default class FixAgent {
    client;
    model = "llama-3.3-70b-versatile";
    constructor() {
        this.client = new OpenAI({
            apiKey: config.openApiKey,
            baseURL: "https://api.groq.com/openai/v1",
        });
    }
    async generateFix(input) {
        const systemPrompt = `
You are an expert debugger.

Return ONLY a valid JSON object matching this schema:

{
  "analysis": {
    "rootCause": "string",
    "errorType": "string",
    "severity": "string",
    "affectedLines": [],
    "explanation": "string"
  },
  "fix": {
    "fixedCode": "string",
    "explanation": "string",
    "changedLines": [],
    "confidence": number
  }
}

IMPORTANT:
- fix.fixedCode MUST always contain complete executable source code.
- Never return phrases like:
  - "No fix needed"
  - "No changes required"
  - "Code is already correct"
  - "Already fixed"
- If the code is already correct, return the ORIGINAL CODE inside fix.fixedCode.
- No markdown.
- No conversational text.
- JSON only.
`;
        const userPrompt = `
LANGUAGE: ${input.language}

CODE:
${input.originalCode}

ERROR:
${JSON.stringify(input.analysis ?? {}, null, 2)}
`;
        try {
            const response = await this.client.chat.completions.create({
                model: this.model,
                temperature: 0.1,
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userPrompt },
                ],
                response_format: { type: "json_object" },
            });
            const raw = response.choices[0]?.message?.content ?? "{}";
            const cleanJson = raw
                .replace(/```json/g, "")
                .replace(/```/g, "")
                .trim();
            const result = JSON.parse(cleanJson);
            const fixedCode = result?.fix?.fixedCode?.trim() ?? "";
            const invalidResponses = [
                "no fix needed",
                "no fix required",
                "code is already correct",
                "already correct",
                "already fixed",
                "no changes required",
            ];
            if (!fixedCode || invalidResponses.includes(fixedCode.toLowerCase())) {
                result.fix.fixedCode = input.originalCode;
            }
            logger.info({
                fixedCode: result.fix.fixedCode,
                confidence: result.fix.confidence,
            }, "[FixAgent] Parsed AI response");
            return result;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            logger.error("FixAgent generation failed: " + errorMessage);
            return {
                analysis: {
                    rootCause: "AI generation failed.",
                    errorType: "GenerationError",
                    severity: "medium",
                    affectedLines: [],
                    explanation: "The model returned a malformed response.",
                },
                fix: {
                    fixedCode: input.originalCode,
                    explanation: "Could not generate fix.",
                    changedLines: [],
                    confidence: 0,
                },
            };
        }
    }
}
