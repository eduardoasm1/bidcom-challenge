import { Injectable, Logger } from '@nestjs/common';
import { getTraceId } from '../context/request-context';

@Injectable()
export class AppLoggerService {
  private readonly logger = new Logger();

  log(message: string, context?: string): void {
    this.logger.log(`[${getTraceId()}] ${message}`, context);
  }

  error(message: string, trace?: string, context?: string): void {
    this.logger.error(`[${getTraceId()}] ${message}`, trace, context);
  }

  warn(message: string, context?: string): void {
    this.logger.warn(`[${getTraceId()}] ${message}`, context);
  }
}
