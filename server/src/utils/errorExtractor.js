export class ErrorExtractor {
    static parse(errorPayload) {
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
    static extractLineNumber(stack) {
        const match = stack.match(/:(\d+):\d+/);
        return match?.[1] ? parseInt(match[1], 10) : -1;
    }
}
