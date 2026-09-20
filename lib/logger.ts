/**
 * Standardized Logging Utility
 * Replaces raw console.log across the application to prepare for
 * integration with structured logging platforms (Datadog, Sentry, etc.)
 */

type LogLevel = 'info' | 'warn' | 'error';

class Logger {
  private log(level: LogLevel, message: string, meta?: any) {
    const timestamp = new Date().toISOString();
    const payload = { timestamp, level, message, ...meta };

    // In a production environment, this could forward to an external service.
    // For now, it outputs structured data locally.
    switch (level) {
      case 'info':
        console.info(`[INFO] ${timestamp}: ${message}`, meta || '');
        break;
      case 'warn':
        console.warn(`[WARN] ${timestamp}: ${message}`, meta || '');
        break;
      case 'error':
        console.error(`[ERROR] ${timestamp}: ${message}`, meta || '');
        break;
    }
  }

  info(message: string, meta?: any) {
    this.log('info', message, meta);
  }

  warn(message: string, meta?: any) {
    this.log('warn', message, meta);
  }

  error(message: string, error?: any, meta?: any) {
    const errorMeta = error instanceof Error ? { name: error.name, stack: error.stack, ...meta } : { error, ...meta };
    this.log('error', message, errorMeta);
  }
}

export const logger = new Logger();
