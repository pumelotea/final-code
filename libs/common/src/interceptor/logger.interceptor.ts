import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { BIZ_LOG_KEY } from '@happykit/common/decorator/log.decorator';
import { catchError, tap, throwError } from 'rxjs';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}
  async intercept(context: ExecutionContext, next: CallHandler) {
    // console.log('LoggerInterceptor');

    const startTime = Date.now();
    const request = context.switchToHttp().getRequest();
    return next
      .handle()
      .pipe(
        catchError((err) =>
          throwError(() => {
            this.processLog(context, startTime, request, err);
            return err;
          }),
        ),
      )
      .pipe(
        tap(() => {
          this.processLog(context, startTime, request);
        }),
      );
  }

  processLog(
    context: ExecutionContext,
    startTime: number,
    request: any,
    error?: Error,
  ) {
    const { query, url, method, body } = request;
    const during = `${Date.now() - startTime}ms`;
    const bizLogMeta = this.reflector.get(BIZ_LOG_KEY, context.getHandler());

    let bizMeta = 'Undefined';
    if (bizLogMeta) {
      bizMeta = JSON.stringify(bizLogMeta);
    }
    let err = 'None';
    if (error) {
      err = error.message;
    }

    // 记录日志
    Logger.log(
      `Request [${method}][${
        request.hostname
      }][${url}][${during}] Params(Body):${JSON.stringify(
        body,
      )}; Params(Query):${JSON.stringify(
        query,
      )}; BizMeta:${bizMeta}; Error:${err}`,
    );
  }
}

export const getReqMainInfo: (req: Request) => {
  [prop: string]: any;
} = (req) => {
  const { query, headers, url, method, body, connection } = req;

  // 获取 IP
  const xRealIp = headers['X-Real-IP'];
  const xForwardedFor = headers['X-Forwarded-For'];
  const { ip: cIp } = req;
  const { remoteAddress } = connection || {};
  const ip = xRealIp || xForwardedFor || cIp || remoteAddress;

  return {
    url,
    host: headers.host,
    ip,
    method,
    query,
    body,
  };
};
