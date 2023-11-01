import {
  HttpException,
  HttpStatus,
  ExceptionFilter,
  Catch,
  ArgumentsHost,
} from '@nestjs/common';
import { Response } from 'express';
import { R } from '@happykit/common/result';
import { Prisma } from '@prisma/client';

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
      response
        .status(404)
        .json(R.failure(404, `API NOT FOUND(${exception.message})`));
      return;
    }

    if (exception instanceof AuthException) {
      response.status(200).json(R.failure(403, exception.message));
      return;
    }

    response.status(200).json(R.failure(-1, exception.message));
  }
}

//https://www.prisma.io/docs/reference/api-reference/error-reference#error-codes
const PrismaErrors: Record<string, string> = {
  P1000: '数据库服务器的身份验证失败，提供的数据库凭据无效',
  P1001: '无法访问数据库服务器',
  P1002: '数据库连接超时',
  P1003: '数据库服务器上不存在数据库',
  P1008: '操作超时',
  P1009: '数据库已存在于数据库服务器',
  P1010: '用户被拒绝访问数据库',
  P1011: '打开 TLS 连接时出错',
  P1012: '操作时发生错误',
  P1013: '提供的数据库字符串无效',
  P1014: '模型的基础不存在',
  P1015: '正在使用数据库版本不支持的功能',
  P1016: '您的原始查询的参数数量不正确',
  P1017: '服务器已关闭连接',
  P2000: '列提供的值对于列的类型限制长度',
  P2001: '搜索的记录不存在',
  P2002: '唯一约束失败',
  P2003: '字段上的外键约束失败',
  P2004: '数据库上的约束失败',
  P2005: '数据库中存储的字段值对于字段的类型无效',
  P2006: '为字段提供的值无效',
  P2007: '数据验证错误',
  P2008: '无法解析查询',
  P2009: '无法验证查询',
  P2010: '原始查询失败',
  P2011: '空约束冲突',
  P2012: '缺少所需的值',
  P2013: '缺少字段on所需的参数',
  P2014: '您尝试进行的更改将违反 和 模型之间所需的关系',
  P2015: '找不到相关记录',
  P2016: '查询解释错误',
  P2017: '和模型之间关系的记录没有连接',
  P2018: '未找到所需的连接记录',
  P2019: '输入错误',
  P2020: '值超出了类型的范围',
  P2021: '当前数据库中不存在该表',
  P2022: '当前数据库中不存在该列',
  P2023: '不一致的列数据',
  P2024: '从连接池中获取新连接超时',
  P2025: '操作失败，因为它依赖于一条或多条需要但未找到的记录',
  P2026: '当前数据库提供程序不支持查询使用的功能',
  P2027: '查询执行期间数据库上发生多个错误',
  P2028: '事务API错误',
  P2030: '找不到用于搜索的全文索引',
  P2031: 'Prisma 需要执行事务，这需要您的 MongoDB 服务器作为副本集运行',
  P2033: '查询中使用的数字不适合64位有符号整数',
  P2034: '由于写入冲突或死锁，事务失败',
};
@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    response.status(200).json(R.failure(-1, '数据：操作失败'));
  }
}
