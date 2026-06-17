export class UniversalRunner {
    getExecutionCommand(language) {
        const lang = language.toLowerCase();
        switch (lang) {
            case "python":
                return "python3 /workspace/script.py";
            case "c":
                return "gcc /workspace/main.c -o /exec/app && chmod +x /exec/app && /exec/app";
            case "cpp":
            case "c++":
                return "g++ /workspace/main.cpp -o /exec/app && chmod +x /exec/app && /exec/app";
            case "java":
                return "javac -d /tmp /workspace/Main.java && java -cp /tmp Main";
            case "r":
                return "Rscript /workspace/script.r";
            case "javascript":
                return "node /workspace/index.js";
            case "typescript":
                return "npx ts-node /workspace/index.ts";
            default:
                throw new Error(`Language ${language} is not supported by sandbox environment.`);
        }
    }
    getFileName(language) {
        const lang = language.toLowerCase();
        switch (lang) {
            case "python":
                return "script.py";
            case "c":
                return "main.c";
            case "cpp":
            case "c++":
                return "main.cpp";
            case "java":
                return "Main.java";
            case "r":
                return "script.r";
            case "javascript":
                return "index.js";
            case "typescript":
                return "index.ts";
            default:
                throw new Error(`Unsupported language: ${language}`);
        }
    }
}
