import { z } from "zod";

export const debugSchema = z.object({
  codeSnippet: z.string().min(1).max(50_000),

  errorPayload: z.object({
    message: z.string(),
    stack: z.string().optional(),
    name: z.string().optional(),
  }),

  language: z
    .enum(["typescript", "javascript", "python", "c", "c++", "cpp", "java"])
    .default("c++"),

  context: z.record(z.string(), z.unknown()).optional(),
});

export const fixSchema = z.object({
  originalCode: z.string().min(1),

  analysis: z.object({
    rootCause: z.string(),
    errorType: z.string(),
    affectedLines: z.array(z.number()),
  }),

  constraints: z.record(z.string(), z.unknown()).optional(),
});
