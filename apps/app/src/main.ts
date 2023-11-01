import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  HttpExceptionFilter,
  PrismaExceptionFilter,
  ServiceException,
} from '@happykit/common/error';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { createLogger } from 'winston';
import { createLoggerOptions } from './config/configuration';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const application = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      instance: createLogger({ ...createLoggerOptions('app') }),
    }),
  });
  //全局异常处理
  application.useGlobalFilters(new HttpExceptionFilter(), new PrismaExceptionFilter());
  //跨域
  application.enableCors();
  //校验
  application.useGlobalPipes(
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

  const configService = application.get(ConfigService);

  //swagger
  const config = new DocumentBuilder()
    .setTitle('APP API')
    .setDescription('The Final Code API Docs')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(application, config);
  SwaggerModule.setup('api', application, document);

  await application.listen(configService.get<number>('server.port')!);
}

bootstrap();
