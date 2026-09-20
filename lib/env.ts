/**
 * Strict Environment Validation Module
 * Validates critical environment variables at application boot.
 * Fails immediately in production to prevent silent errors.
 */

const requiredEnvVars = [
  'NEXT_PUBLIC_API_URL',
  'AUTH_SECRET',
];

export function validateEnv() {
  const missing = requiredEnvVars.filter((envVar) => !process.env[envVar]);

  if (missing.length > 0) {
    const errorMsg = `Critical environment variables missing: ${missing.join(', ')}`;
    
    if (process.env.NODE_ENV === 'production') {
      throw new Error(errorMsg);
    } else {
      console.warn(`[DEV WARNING]: ${errorMsg}`);
    }
  }
}

// Optionally export an environment object for strongly typed access
export const env = {
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  AUTH_SECRET: process.env.AUTH_SECRET || 'dev_secret_override',
  NODE_ENV: process.env.NODE_ENV || 'development',
};
