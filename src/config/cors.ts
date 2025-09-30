import cors from "cors";

// CORS configuration
export const corsOptions: cors.CorsOptions = {
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
    "Access-Control-Request-Method",
    "Access-Control-Request-Headers",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  optionsSuccessStatus: 204,
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      callback(null, true);
      return;
    }

    const allowedOrigins = [
      "http://localhost:3000",
      "http://localhost:5173", // Vite dev server
      "http://127.0.0.1:3000",
      process.env.FRONTEND_URL,
    ].filter(Boolean);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    } else {
      // In production, you might want to be more restrictive
      if (process.env.NODE_ENV === "production") {
        callback(new Error("Not allowed by CORS"), false);
        return;
      } else {
        // In development, be more permissive
        callback(null, true);
        return;
      }
    }
  },
};

export const corsMiddleware = cors(corsOptions);
