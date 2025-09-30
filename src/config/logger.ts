import winston from "winston";

// Define log format
const logFormat = winston.format.combine(winston.format.timestamp(), winston.format.errors({ stack: true }), winston.format.json());

// Create the logger
export const logger = winston.createLogger({
  defaultMeta: { service: "express-api" },
  format: logFormat,
  level: process.env.LOG_LEVEL ?? "info",
  transports: [
    new winston.transports.File({
      filename: "logs/error.log",
      format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
      level: "error",
    }),
    new winston.transports.File({
      filename: "logs/combined.log",
      format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    }),
  ],
});

// If we're not in production, also log to the console
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.printf((info: winston.Logform.TransformableInfo) => {
          const timestamp = typeof info.timestamp === "string" ? info.timestamp : "";
          const level = typeof info.level === "string" ? info.level : "info";
          const message = typeof info.message === "string" ? info.message : JSON.stringify(info.message);
          const meta = info;

          return `${timestamp} [${level}]: ${message}${Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta, null, 2)}` : ""}`;
        }),
      ),
    }),
  );
}

// Create a stream for Morgan
export const morganStream = {
  write: (message: string): void => {
    logger.info(message.trim());
  },
};
