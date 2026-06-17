import pino from "pino";
import { config } from "../config/index.js";

export const logger = pino({
  level: config.logLevel,
  ...(config.env === "development"
    ? {
        transport: {
          target: "pino-pretty",
          options: { colorize: true },
        },
      }
    : {}),
  formatters: {
    level: (label: string) => ({ level: label }),
  },
  base: { service: "probe-server" },
});
