import { AsyncLocalStorage } from 'node:async_hooks';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request } from 'express';
import { ReqUser } from '@happykit/common';

export const asyncLocalStorage = new AsyncLocalStorage<any>();

export function getCurrentRequest(): Request & ReqUser {
  return asyncLocalStorage.getStore();
}
@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  constructor() {}

  use(req: any, res: any, next: any): any {
    asyncLocalStorage.run(req, () => {
      next();
    });
  }
}
