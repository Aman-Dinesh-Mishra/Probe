import { logger } from "../utils/logger.js";
import type { ParsedError, RuntimeInfo } from "../types/debug.types.js";

export class RuntimeAnalysisAgent {
    async analyze(
        code: string,
        error: ParsedError
    ): Promise<RuntimeInfo> {
        logger.debug("[RuntimeAnalysisAgent] Analyzing code patterns");

        const lines = code.split("\n");
        const asyncPatterns = this.detectAsyncPatterns(lines);
        const unhandledRejections = this.detectUnhandledRejections(lines);
        const nullDerefs = this.detectNullDereferences(lines, error);
        const memoryIssues = this.detectMemoryPatterns(lines);

        return {
            asyncPatterns,
            unhandledRejections,
            potentialNullDerefs: nullDerefs,
            memoryWarnings: memoryIssues,
            errorLineContext: this.extractLineContext(lines, error.lineNumber),
        };
    }

    private detectAsyncPatterns(lines: string[]): string[] {
        const patterns: string[] = [];
        lines.forEach((line, i) => {
            if (/await/.test(line) && !/async/.test(lines[i - 1] ?? "")) {
                patterns.push(`Line ${i + 1}: await outside async function`);
            }
            if (/\.then\(/.test(line) && /async/.test(line)) {
                patterns.push(`Line ${i + 1}: Mixed async/await and .then() chaining`);
            }
        });
        return patterns;
    }

    private detectUnhandledRejections(lines: string[]): string[] {
        return lines
        .map((line,i)=> ({line,i}))
        .filter(({line})=> /new Promise/.test(line) && !line.includes(".catch"))
        .map(({i})=> `Line ${i + 1} : Promise without .catch() handler`);
    }

    private detectNullDereferences(lines: string[], error: ParsedError): string[] {
    if (!error.message.includes("Cannot read property")) return [];
    return lines
        .filter(l => !/\?\./.test(l) && /\w+\.\w+/.test(l))
        .slice(0, 3)
        .map(l => `Potential null dereference: ${l.trim()}`);
}


    private detectMemoryPatterns(lines: string[]): string[] {
        const warnings: string[] = [];
        const setIntervalCount = lines.filter(l => /setIntervalCount/.test(l)).length;
        if(setIntervalCount > 0 && !lines.some(l => /clearInterval/.test(l)))
            warnings.push("setInterval used without clearInterval - potential memory leak");
        return warnings;
    }

    private extractLineContext(lines: string[], lineNumber?: number): string {
        if (lineNumber === undefined) return "";
        const contextStart = Math.max(0, lineNumber - 2);
        const contextEnd = Math.min(lines.length, lineNumber + 1);
        return lines.slice(contextStart, contextEnd).join("\n");
    }
}
