import express from "express";
import type { Application } from "express";
import cors from "cors";
import helmet from "helmet";

import { requestLogger } from "./middleware/requestLogger.middleware.js";
import errorHandler from "./middleware/errorHandler.middleware.js";

import debugRoutes from "./routes/debug.routes.js";
import fixRoutes from "./routes/fix.routes.js";
import validateRoutes from "./routes/validate.routes.js";

const app: Application = express();

app.get("/health", (_, res) => {
  res.status(200).json({ status: "ok" });
});

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: ["http://localhost:3000", "https://probe-delta-lemon.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  }),
);

app.options("*", cors());

app.use(helmet());

app.use(requestLogger);

app.use("/api/debug", debugRoutes);
app.use("/api/fix", fixRoutes);
app.use("/api/validate", validateRoutes);

app.use(errorHandler);

export default app;
