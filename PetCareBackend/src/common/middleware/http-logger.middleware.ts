import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction): void {
    const { method, originalUrl, ip } = req;
    const userAgent = req.get('user-agent') || '';
    const startTime = Date.now();

    // Log request body if present (hide sensitive fields)
    let bodySummary = '';
    if (req.body && Object.keys(req.body).length > 0) {
      const sanitizedBody = { ...req.body };
      if (sanitizedBody.password) sanitizedBody.password = '***';
      if (sanitizedBody.refreshToken) sanitizedBody.refreshToken = '***';
      bodySummary = ` | Body: ${JSON.stringify(sanitizedBody)}`;
    }

    res.on('finish', () => {
      const { statusCode } = res;
      const contentLength = res.get('content-length') || 0;
      const responseTime = Date.now() - startTime;

      const logMessage = `[${method}] ${originalUrl} -> ${statusCode} (${responseTime}ms) [${contentLength}B]${bodySummary}`;

      if (statusCode >= 500) {
        this.logger.error(logMessage);
      } else if (statusCode >= 400) {
        this.logger.warn(logMessage);
      } else {
        this.logger.log(logMessage);
      }
    });

    next();
  }
}
