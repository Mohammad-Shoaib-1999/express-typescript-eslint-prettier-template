import type { Request } from "express";

import { morganStream } from "#config/logger.js";
import morgan from "morgan";

// Morgan token for request ID (you can enhance this with a real request ID)
morgan.token("id", (req: Request): string => {
  const requestId = (req as Request & { id?: string }).id ?? "-";
  return requestId;
});

// Development format - colorful and detailed
export const devFormat = ":method :url :status :res[content-length] - :response-time ms";

// Production format - structured JSON
export const prodFormat = JSON.stringify({
  content_length: ":res[content-length]",
  method: ":method",
  remote_addr: ":remote-addr",
  response_time: ":response-time",
  status: ":status",
  timestamp: ":date[iso]",
  url: ":url",
  user_agent: ":user-agent",
});

// Morgan middleware based on environment
export const morganMiddleware = morgan(process.env.NODE_ENV === "production" ? prodFormat : devFormat, {
  skip: (req, res) => {
    // Skip health checks in production to reduce log noise
    if (process.env.NODE_ENV === "production" && req.url === "/health") {
      return res.statusCode < 400;
    }
    return false;
  },
  stream: morganStream,
});
