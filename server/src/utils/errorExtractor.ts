import type { ParsedError } from "../types/debug.types.js";

export class ErrorExtractor {
  static parse(errorPayload: {
    message?: string;
    stack?: string;
    name?: string;
  }): ParsedError {

    const stack = errorPayload.stack ?? "";

    const lineNumber = ErrorExtractor.extractLineNumber(stack);

    return {
      message: errorPayload.message ?? "Unknown Error",
      name: errorPayload.name ?? "Error",
      stack,
      lineNumber,
      isAsync: stack.includes("async"),
      isTypeError: (errorPayload.name ?? "").includes("TypeError")
    };
  }

  private static extractLineNumber(stack: string): number {
    const match = stack.match(/:(\d+):\d+/);

    return match?.[1] ? parseInt(match[1], 10) : -1;
  }
}