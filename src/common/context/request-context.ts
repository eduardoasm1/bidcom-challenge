import { AsyncLocalStorage } from 'async_hooks';

interface RequestContext {
  traceId: string;
}

export const requestContext = new AsyncLocalStorage<RequestContext>();

export const getTraceId = (): string =>
  requestContext.getStore()?.traceId ?? 'no-trace';
