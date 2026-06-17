import express from "express";
import cors from "cors";
import helmet from "helmet";
import { requestLogger } from "./middleware/requestLogger.middleware.js";
import errorHandler from "./middleware/errorHandler.middleware.js";
import debugRoutes from "./routes/debug.routes.js";
import fixRoutes from "./routes/fix.routes.js";
import validateRoutes from "./routes/validate.routes.js";
const app = express();
app.get("/health", (_, res) => {
    res.status(200).json({
        status: "ok",
    });
});
// Security and CORS
app.use(helmet());
const allowedOrigins = [
    "http://localhost:3000",
    process.env.FRONTEND_URL,
].filter((origin) => !!origin);
app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));
// Body parsing
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
// Custom middleware
app.use(requestLogger);
// Routes
app.use("/api/debug", debugRoutes);
app.use("/api/fix", fixRoutes);
app.use("/api/validate", validateRoutes);
app.use(errorHandler);
export default app;
