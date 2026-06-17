import { DockerExecutor } from "../sandbox/dockerExecutor.js";
import { UniversalRunner } from "../validators/universalValidator.js";
import { logger } from "../utils/logger.js";
import type {
  ValidationRequest,
  ValidationResult,
} from "../types/api.types.js";

export default class ValidationService {
  private dockerExecutor: DockerExecutor;
  private universalRunner: UniversalRunner;

  constructor() {
    this.dockerExecutor = new DockerExecutor();
    this.universalRunner = new UniversalRunner();
  }

  async validateFix(request: ValidationRequest): Promise<ValidationResult> {
    logger.info(
      {
        language: request.language,
        fixedCode: request.fixedCode,
      },
      "[ValidationService] Incoming validation payload",
    );

    const code = request.fixedCode?.trim() ?? "";

    const invalidResponses = [
      "no fix needed",
      "no fix required",
      "code is already correct",
      "no changes required",
      "already correct",
    ];

    if (!code) {
      return {
        passed: false,
        totalTests: 1,
        passed_count: 0,
        failed_count: 1,
        failures: [
          {
            name: "Validation Error",
            message: "No fixed code received for validation.",
          },
        ],
      };
    }

    if (invalidResponses.includes(code.toLowerCase())) {
      return {
        passed: false,
        totalTests: 1,
        passed_count: 0,
        failed_count: 1,
        failures: [
          {
            name: "Invalid Fix Output",
            message:
              "Fix agent returned explanatory text instead of executable source code.",
          },
        ],
      };
    }

    const containerId = await this.dockerExecutor.run({
      code,
      language: request.language,
      timeout: 30_000,
    });

    try {
      const runCommand = this.universalRunner.getExecutionCommand(
        request.language,
      );

      logger.info(
        {
          language: request.language,
          runCommand,
        },
        "[ValidationService] Executing code",
      );

      const executionObj = await this.dockerExecutor.exec(
        containerId,
        runCommand,
      );

      logger.info(
        {
          exitCode: executionObj.exitCode,
          output: executionObj.output,
        },
        "[ValidationService] Execution result",
      );

      const isFailed = executionObj.exitCode !== 0;

      const result: ValidationResult = {
        passed: !isFailed,
        totalTests: 1,
        passed_count: isFailed ? 0 : 1,
        failed_count: isFailed ? 1 : 0,
        failures: isFailed
          ? [
              {
                name: `${request.language} Execution Failure`,
                message: executionObj.output,
              },
            ]
          : [],
      };

      logger.info(
        {
          passed: result.passed,
        },
        "[ValidationService] Validation complete",
      );

      return result;
    } catch (err: any) {
      logger.error(
        {
          error: err,
        },
        "[ValidationService] Exception caught during validation",
      );

      return {
        passed: false,
        totalTests: 1,
        passed_count: 0,
        failed_count: 1,
        failures: [
          {
            name: "Sandbox Engine Error",
            message: err?.message || "Failed to execute",
          },
        ],
      };
    } finally {
      await this.dockerExecutor.cleanup(containerId);
    }
  }
}
