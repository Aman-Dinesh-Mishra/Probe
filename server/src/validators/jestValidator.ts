import { logger } from "../utils/logger.js";

export interface JestTestResult {
  numTotalTests: number;
  numPassedTests: number;
  numFailedTests: number;
  testResults: Array<{
    fullName: string;
    status: "passed" | "failed" | "pending";
    failureMessages: string[];
  }>;
}

export class JestValidator {
  async run(containerId: string): Promise<JestTestResult> {
    const { DockerExecutor } = await import("../sandbox/dockerExecutor.js");
    const executor = new DockerExecutor();
    let output = "";
    try {
      const result = await executor.exec(
        containerId,
        "npx jest --json --no-coverage",
      );
      output = result.output;
    } catch (error: any) {
      output = error.stdout ?? error.message ?? "";
    }
    return this.parseJestOutput(output);
  }

  private parseJestOutput(raw: string): JestTestResult {
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) {
      logger.info("[JestValidator] No JSON found in Jest Output");
      return {
        numTotalTests: 0,
        numPassedTests: 0,
        numFailedTests: 0,
        testResults: [],
      };
    }
    try {
      return JSON.parse(match[0]) as JestTestResult;
    } catch {
      logger.error("[JestValidator] Failed to parse Jest JSON");
      return {
        numTotalTests: 0,
        numPassedTests: 0,
        numFailedTests: 0,
        testResults: [],
      };
    }
  }
}
