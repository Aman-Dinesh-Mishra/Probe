import { exec } from "child_process";
import { promisify } from "util";
import * as fs from "fs/promises";
import * as path from "path";
import * as os from "os";
import { logger } from "../utils/logger.js";
const execAsync = promisify(exec);
const languageExtensions = {
    c: "main.c",
    cpp: "main.cpp",
    "c++": "main.cpp",
    java: "Main.java",
    python: "script.py",
    r: "script.r",
    javascript: "index.js",
    typescript: "index.ts",
};
export class DockerExecutor {
    async run(options) {
        const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "probe-"));
        const filename = languageExtensions[options.language.toLowerCase()] || "index.ts";
        const filePath = path.join(tmpDir, filename);
        await fs.writeFile(filePath, options.code, "utf-8");
        logger.info({
            tmpDir,
            filename,
            language: options.language,
        }, "[DockerExecutor] Preparing container launch strings");
        const commandStr = [
            "docker run -d",
            "--network none",
            "--memory 256m",
            "--cpus 0.5",
            "--read-only",
            "--tmpfs /tmp:rw,noexec,nosuid,size=64m",
            "--tmpfs /run:rw,noexec,nosuid,size=64m",
            "--tmpfs /exec:rw,exec,size=64m",
            `-v "${tmpDir}:/workspace:ro"`,
            "probe-sandbox:latest",
            "sleep infinity",
        ].join(" ");
        const { stdout } = await execAsync(commandStr, {
            timeout: options.timeout,
        });
        const containerId = stdout.trim();
        logger.info({ containerId }, "[DockerExecutor] Container successfully deployed");
        return containerId;
    }
    async exec(containerId, command) {
        try {
            logger.info({ containerId, command }, "[DockerExecutor] Executing command");
            const { stdout, stderr } = await execAsync(`docker exec ${containerId} sh -c "${command}; echo EXIT_CODE:$?"`, { timeout: 30_000 });
            const match = stdout.match(/EXIT_CODE:(\d+)/);
            const exitCode = match ? parseInt(match[1], 10) : 1;
            const cleanOutput = stdout.replace(/EXIT_CODE:\d+\s*$/, "").trim();
            return {
                exitCode,
                output: [cleanOutput, stderr].filter(Boolean).join("\n"),
            };
        }
        catch (execError) {
            return {
                exitCode: 1,
                output: execError.stderr ||
                    execError.stdout ||
                    execError.message ||
                    "Execution failed",
            };
        }
    }
    async cleanup(containerId) {
        try {
            await execAsync(`docker rm -f ${containerId}`);
            logger.info({ containerId }, "[DockerExecutor] Container resource wrapper recycled");
        }
        catch (error) {
            logger.warn({ error }, "[DockerExecutor] Cleanup wrapper completed with warnings");
        }
    }
}
