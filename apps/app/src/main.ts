import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter, ServiceException } from '@happykit/common/error';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { createLogger } from 'winston';
import { loggerOptions } from './config/configuration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      instance: createLogger({ ...loggerOptions }),
    }),
  });
  //全局异常处理
  app.useGlobalFilters(new HttpExceptionFilter());
  //跨域
  app.enableCors();
  //校验
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (errors) => {
        //重写错误返回
        const err = errors[0];
        const constraints = err.constraints![Object.keys(err.constraints!)[0]];
        return new ServiceException(`${constraints}`);
      },
    }),
  );

  const configService = app.get(ConfigService);

  await app.listen(configService.get<number>('server.port')!);
}

bootstrap();
