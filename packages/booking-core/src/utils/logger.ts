export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogMeta {
  [key: string]: unknown;
}

class Logger {
  private level: LogLevel = 'info';

  constructor() {
    const envLevel = process.env.LOG_LEVEL as LogLevel;
    if (envLevel && ['debug', 'info', 'warn', 'error'].includes(envLevel)) {
      this.level = envLevel;
    }
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: Record<LogLevel, number> = { debug: 0, info: 1, warn: 2, error: 3 };
    return levels[level] >= levels[this.level];
  }

  private sanitize(meta?: LogMeta): LogMeta | undefined {
    if (!meta) return undefined;
    const sanitized: LogMeta = { ...meta };
    const sensitiveKeys = ['password', 'token', 'authorization', 'secret', 'cardNumber', 'cvv'];
    for (const key of Object.keys(sanitized)) {
      if (sensitiveKeys.some(s => key.toLowerCase().includes(s))) {
        sanitized[key] = '[REDACTED]';
      }
    }
    return sanitized;
  }

  private format(level: LogLevel, message: string, meta?: LogMeta): string {
    return JSON.stringify({
      timestamp: new Date().toISOString(),
      level,
      message,
      ...(this.sanitize(meta) ? { meta: this.sanitize(meta) } : {}),
    });
  }

  debug(message: string, meta?: LogMeta): void {
    if (this.shouldLog('debug')) console.debug(this.format('debug', message, meta));
  }

  info(message: string, meta?: LogMeta): void {
    if (this.shouldLog('info')) console.info(this.format('info', message, meta));
  }

  warn(message: string, meta?: LogMeta): void {
    if (this.shouldLog('warn')) console.warn(this.format('warn', message, meta));
  }

  error(message: string, meta?: LogMeta): void {
    if (this.shouldLog('error')) console.error(this.format('error', message, meta));
  }
}

export const logger = new Logger();
