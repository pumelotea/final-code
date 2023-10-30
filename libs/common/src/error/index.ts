import { HttpException, HttpStatus, ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import {} from '@nestjs/common';
import { Response } from 'express';
import { R } from '@happykit/common/result';

export class ServiceException extends HttpException {
  constructor(msg: string) {
    super(`业务错误:${msg}`, HttpStatus.OK);
  }
}
export class AuthException extends HttpException {
  constructor(msg: string) {
    super(`鉴权:${msg}`, HttpStatus.OK);
  }
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    // const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    if (status === 404) {
      response.status(404).json(R.failure(404, `API NOT FOUND(${exception.message})`));
      return;
    }

    if (exception instanceof AuthException) {
      response.status(200).json(R.failure(403, exception.message));
      return;
    }

    response.status(200).json(R.failure(-1, exception.message));
  }
}
