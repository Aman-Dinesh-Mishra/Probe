import type { DebugResult } from "./debug.types.js";

export interface DebugRequest {
  codeSnippet: string;
  errorPayload: {
    message: string;
    stack?: string;
    name?: string;
  };
  language?: "typescript" | "javascript" | "c" | "c++" | "python" | "java";
}

export interface FixRequest {
  originalCode: string;
  language: string;
  analysis: DebugResult;
  constraints?: Record<string, unknown>;
}

export interface AnalysisResult {
  rootCause: string;
  errorType: string;
  severity: string;
  affectedLines: number[];
  explanation: string;
}

export interface FixData {
  fixedCode: string;
  explanation: string;
  changedLines: number[];
  confidence: number;
}

export interface FixResult {
  analysis: AnalysisResult;
  fix: FixData;
}

export interface FixAgentInput extends FixRequest {}

export interface ValidationRequest {
  fixedCode: string;
  originalCode: string;
  testFiles?: string[];
  language: string;
}

export interface ValidationResult {
  passed: boolean;
  totalTests: number;
  passed_count: number;
  failed_count: number;
  failures: Array<{
    name: string;
    message: string;
  }>;
}
