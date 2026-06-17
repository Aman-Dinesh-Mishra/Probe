export interface ParsedError {
  message: string;
  name: string;
  stack: string;
  lineNumber?: number;
  isAsync: boolean;
  isTypeError: boolean;
}

export interface RagContext {
  similarity: number;
  errorMessage: string;
  rootCause: string;
  solution: string;
}

export interface RuntimeInfo {
  asyncPatterns: string[];
  unhandledRejections: string[];
  potentialNullDerefs: string[];
  memoryWarnings: string[];
  errorLineContext: string;
}

export interface DebugAgentInput {
  language: string;
  parsedError: ParsedError;
  context: RagContext[];
  runtimeInfo: RuntimeInfo;
  originalCode: string;
}

export type ErrorSeverity = "low" | "medium" | "high" | "critical";

export interface DebugResult {
  rootCause: string;
  errorType: string;
  severity: ErrorSeverity;
  affectedLines: number[];
  explanation: string;
  suggestedApproach: string;
}

export interface DebugRequest {
  codeSnippet: string;
  errorPayload: {
    message: string;
    stack?: string;
    name?: string;
  };
  language: string;
}
