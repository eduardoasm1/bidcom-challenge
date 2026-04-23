import { Injectable, NestMiddleware } from '@nestjs/common';
import { IncomingMessage, ServerResponse } from 'http';
import { randomUUID } from 'crypto';
import { requestContext } from '../context/request-context';
import { AppLoggerService } from '../logger/app-logger.service';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: AppLoggerService) {}

  use(req: IncomingMessage, res: ServerResponse, next: () => void): void {
    const traceId = randomUUID();
    const { method, url } = req;
    const start = Date.now();

    requestContext.run({ traceId }, () => {
      res.on('finish', () => {
        const ms = Date.now() - start;
        this.logger.log(`${method} ${url} ${res.statusCode} ${ms}ms`, 'HTTP');
      });

      next();
    });
  }
}
