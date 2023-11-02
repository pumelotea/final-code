import {
  HttpException,
  HttpStatus,
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import { R } from '@happykit/common/result';
import { Prisma } from '@prisma/client';

export class ServiceException extends HttpException {
  code = -1;
  constructor(msg: string, code = -1) {
    super(`业务错误:${msg}`, HttpStatus.OK);
    this.code = code;
  }
}
export class AuthException extends HttpException {
  constructor(msg: string) {
    super(`鉴权:${msg}`, HttpStatus.OK);
  }
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    if (exception instanceof NotFoundException) {
      response
        .status(404)
        .json(R.failure(404, `API NOT FOUND(${exception.message})`));
      return;
    }

    if (exception instanceof AuthException) {
      response.status(200).json(R.failure(403, exception.message));
      return;
    }

    if (
      exception instanceof Prisma.PrismaClientKnownRequestError ||
      exception instanceof Prisma.PrismaClientUnknownRequestError ||
      exception instanceof Prisma.PrismaClientInitializationError ||
      exception instanceof Prisma.PrismaClientRustPanicError ||
      exception instanceof Prisma.PrismaClientValidationError
    ) {
      //https://www.prisma.io/docs/reference/api-reference/error-reference#error-codes
      response.status(200).json(R.failure(-1, '数据：操作失败'));
      return;
    }

    if (exception instanceof ServiceException) {
      response.status(200).json(R.failure(exception.code, exception.message));
      return;
    }

    response.status(200).json(R.failure(-1, exception.message));
  }
}
