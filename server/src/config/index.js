import dotenv from "dotenv";
dotenv.config();
function require_env(key) {
    const value = process.env[key];
    if (!value)
        throw new Error(`Missing required env var: ${key}`);
    return value;
}
export const config = {
    port: parseInt(process.env.PORT ?? "8000", 10),
    env: process.env.NODE_ENV ?? "development",
    openApiKey: require_env("OPENAI_API_KEY"),
    openAiBaseUrl: process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1",
    pineconeApiKey: require_env("PINECONE_API_KEY"),
    pineconeIndex: require_env("PINECONE_INDEX"),
    dockerImage: process.env.DOCKER_IMAGE ?? "probe-sandbox:latest",
    logLevel: process.env.LOG_LEVEL ?? "info",
};
