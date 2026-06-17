import app from "./app.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {
  console.log(` PROBE Backend Service`);
  console.log(` Mode: ${process.env.NODE_ENV || "development"}`);
  console.log(`Listening on address: http://localhost:${PORT}`);
  console.log(
    `Docker Image Map: ${process.env.DOCKER_IMAGE || "probe-sandbox:latest"}`,
  );
});

process.on("SIGTERM", () => {
  console.log("SIGTERM signal received. Shutting down gracefully...");
  server.close(() => {
    console.log("HTTP server closed.");
  });
});
