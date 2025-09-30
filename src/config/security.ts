import helmet from "helmet";

// Helmet configuration for security headers
export const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
    },
  },
  crossOriginResourcePolicy: { policy: "cross-origin" },
  hsts: {
    includeSubDomains: true,
    maxAge: 31536000,
    preload: true,
  },
});

// Custom security middleware
export const securityMiddleware = [
  helmetConfig,
  // Add any other security-related middleware here
];
