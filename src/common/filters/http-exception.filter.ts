import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { randomUUID } from 'crypto';
import { DEFAULT_ERROR_CODE, ERROR_CODES } from '../constants/error-codes';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const reply = ctx.getResponse<FastifyReply>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorMessage =
      exception instanceof HttpException
        ? this.extractMessage(exception)
        : 'Internal server error';

    reply.status(status).send({
      error: errorMessage,
      code: ERROR_CODES[status] ?? DEFAULT_ERROR_CODE,
      traceId: randomUUID(),
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
