/**
 * Application configuration factory
 * Centralizes all environment variable management and default values
 */

/**
 * Safely parses an integer from environment variable
 */
const parseIntSafe = (value: string | undefined, defaultValue: number): number => {
  if (!value) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
};

/**
 * Safely parses a float from environment variable
 */
const parseFloatSafe = (value: string | undefined, defaultValue: number): number => {
  if (!value) return defaultValue;
  const parsed = parseFloat(value);
  return isNaN(parsed) ? defaultValue : parsed;
};

export const configuration = () => ({
  // Server configuration
  port: parseIntSafe(process.env.PORT, 3000),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // CORS configuration
  allowedOrigins: process.env.ALLOWED_ORIGINS || 'http://localhost:3000,http://localhost:3001',
  
  // API configuration
  apiVersion: process.env.API_VERSION || 'v1',
  apiPrefix: process.env.API_PREFIX || 'api',
  
  // Rate limiting configuration
  rateLimitTtl: parseIntSafe(process.env.RATE_LIMIT_TTL, 60),
  rateLimitMax: parseIntSafe(process.env.RATE_LIMIT_MAX, 100),
  
  // Location discovery configuration
  discovery: {
    defaultRadius: parseFloatSafe(process.env.DEFAULT_RADIUS, 5.0), // km
    maxRadius: parseFloatSafe(process.env.MAX_RADIUS, 50.0), // km
    maxResults: parseIntSafe(process.env.MAX_RESULTS, 50),
  },
  
  // Logging configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.LOG_FORMAT || 'combined',
  },
}); 