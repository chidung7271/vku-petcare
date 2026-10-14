import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | object = 'Internal Server Error';
    let errorCode = 'INTERNAL_ERROR';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      if (typeof res === 'object' && res !== null) {
        message = (res as any).message || exception.message;
        errorCode = (res as any).error || 'HTTP_ERROR';
      } else {
        message = res;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      errorCode = exception.name;
    }

    // Format concise log for client errors (4xx), detailed for server errors (500)
    if (status >= 500) {
      this.logger.error(
        `[${request.method}] ${request.url} - Status: ${status} - Error: ${JSON.stringify(message)}`,
        exception instanceof Error ? exception.stack : ''
      );
    } else {
      this.logger.warn(
        `[${request.method}] ${request.url} - Status: ${status} - Error: ${JSON.stringify(message)}`
      );
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      message: Array.isArray(message) ? message[0] : message,
      allErrors: Array.isArray(message) ? message : undefined,
      errorCode,
      timestamp: new Date().toISOString(),
      path: request.url
    });
  }
}
