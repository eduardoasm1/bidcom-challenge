import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { DEFAULT_ERROR_CODE, ERROR_CODES } from '../constants/error-codes';
import { getTraceId } from '../context/request-context';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const reply = ctx.getResponse<FastifyReply>();
    const traceId = getTraceId();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorMessage =
      exception instanceof HttpException
        ? this.extractMessage(exception)
        : 'Internal server error';

    if (status >= 500) {
      this.logger.error(
        `[${traceId}] ${errorMessage}`,
        exception instanceof Error ? exception.stack : undefined,
      );
    } else {
      this.logger.warn(`[${traceId}] ${status} ${errorMessage}`);
    }

    reply.status(status).send({
      error: errorMessage,
      code: ERROR_CODES[status] ?? DEFAULT_ERROR_CODE,
      traceId,
    });
  }

  private extractMessage(exception: HttpException): string {
    const response = exception.getResponse();
    if (typeof response === 'string') return response;
    if (typeof response === 'object' && response !== null) {
      const r = response as Record<string, unknown>;
      if (Array.isArray(r['message']))
        return (r['message'] as string[]).join(', ');
      if (typeof r['message'] === 'string') return r['message'];
    }
    return exception.message;
  }
}
