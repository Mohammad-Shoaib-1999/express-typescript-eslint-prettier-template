import { corsMiddleware } from "#config/cors.js";
import { logger } from "#config/logger.js";
import { morganMiddleware } from "#config/morgan.js";
import { securityMiddleware } from "#config/security.js";
import express, { NextFunction, Request, Response } from "express";

const app = express();
const port = Number(process.env.PORT ?? 3000);

// Security middleware first
app.use(securityMiddleware);

// CORS middleware
app.use(corsMiddleware);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// HTTP request logging
app.use(morganMiddleware);

// Health check route
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    environment: process.env.NODE_ENV ?? "development",
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Your existing routes
app.get("/", (req: Request, res: Response) => {
  logger.info("Root route accessed", {
    ip: req.ip,
    userAgent: req.get("User-Agent"),
  });
  res.send("Hello World!");
});

// Error handling middleware (should be last)
app.use((err: unknown, req: Request, res: Response, _next: NextFunction): void => {
  const error = typeof err === "object" && err !== null ? (err as { message?: string; stack?: string; status?: number }) : {};

  const statusCode = typeof error.status === "number" ? error.status : 500;
  const message = typeof error.message === "string" ? error.message : "Internal Server Error";
  const stack = typeof error.stack === "string" ? error.stack : undefined;

  logger.error("Unhandled error", {
    error: message,
    method: req.method,
    stack,
    url: req.url,
  });

  res.status(statusCode).json({
    error: process.env.NODE_ENV === "production" ? "Something went wrong!" : message,
    ...(process.env.NODE_ENV !== "production" && stack ? { stack } : {}),
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  logger.warn("404 Not Found", { method: req.method, url: req.url });
  res.status(404).json({ error: "Not Found" });
});

app.listen(port, () => {
  logger.info("Server started successfully", {
    environment: process.env.NODE_ENV ?? "development",
    nodeVersion: process.version,
    port,
  });
  console.log(`Example app listening on port ${port}`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  logger.info("SIGTERM received, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  logger.info("SIGINT received, shutting down gracefully");
  process.exit(0);
});

export default app;
