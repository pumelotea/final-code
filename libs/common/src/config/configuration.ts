import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'nestjs-prisma';
import { ConfigService } from '@nestjs/config';
import { JWtOption, MySQLOption, RedisOption } from '@happykit/common';
import { RedisModule } from '@songkeys/nestjs-redis';
import * as process from 'process';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import { FileModule } from '@happykit/common/file/file.module';
import { FileModuleOptions } from '@happykit/common/file/file.module-definition';
import { NestFactory } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';
import { createLogger } from 'winston';
import { HttpExceptionFilter, ServiceException } from '@happykit/common/error';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@codecoderun/swagger';
import { getCurrentRequest } from '@happykit/common/context/request-context';

/**
 * JWT 模块
 */
export const jwtModule = JwtModule.registerAsync({
  inject: [ConfigService],
  global: true,
  useFactory(configService: ConfigService) {
    const jwtCfg = configService.get<JWtOption>('jwt')!;
    return {
      secret: jwtCfg.secret,
      signOptions: { expiresIn: jwtCfg.expiresIn },
    };
  },
});

/**
 * prisma模块
 */
export const prismaModule = PrismaModule.forRootAsync({
  inject: [ConfigService],
  isGlobal: true,
  useFactory(configService: ConfigService) {
    const mySQLOption = configService.get<MySQLOption>('mysql.client')!;
    return {
      prismaOptions: { datasourceUrl: mySQLOption.datasourceUrl },
      middlewares: [
        // SOFT DELETE
        async (params, next) => {
          const req = getCurrentRequest();
          let userId = null;
          if (req?.user) {
            userId = `${req.user.id}`;
          }
          if (params.action == 'delete') {
            // Delete queries
            // Change action to an update
            params.action = 'update';
            params.args['data'] = {
              deleted: new Date(),
              deletedBy: userId,
            };
            params.args['where']['deleted'] = null;
          }
          if (params.action == 'deleteMany') {
            // Delete many queries
            params.action = 'updateMany';
            if (params.args.data != undefined) {
              params.args.data['deleted'] = new Date();
              params.args.data['deletedBy'] = userId;
              params.args['where']['deleted'] = null;
            } else {
              params.args['data'] = { deleted: new Date() };
              params.args['where']['deleted'] = null;
            }
          }

          if (params.action == 'update' || params.action == 'updateMany') {
            if (!params.args['data']['updatedBy']) {
              params.args['data']['updatedBy'] = userId;
            }
          }

          if (params.action == 'create' || params.action == 'createMany') {
            if (!params.args['data']['createdBy']) {
              params.args['data']['createdBy'] = userId;
            }
          }
          return await next(params);
        },
      ],
    };
  },
});

/**
 * redis模块
 */
export const redisModule = RedisModule.forRootAsync(
  {
    inject: [ConfigService],
    useFactory(configService: ConfigService) {
      return {
        config: {
          ...configService.get<RedisOption>('redis.config')!,
        },
      };
    },
  },
  true,
);

/**
 * 文件模块
 */
export const fileModule = FileModule.registerAsync({
  inject: [ConfigService],
  useFactory(configService: ConfigService) {
    const opt = configService.get<FileModuleOptions>('upload')!;
    // 自定义配置
    opt.extra = configService.get<FileModuleOptions>('minio')!;
    return opt;
  },
});

/**
 * 日志模块
 */
const colorize = winston.format.colorize();

colorize.addColors({
  cyan: 'cyan',
  yellow: 'yellow',
  magenta: 'magenta',
});

const logFormatColorful = winston.format.printf(
  ({ level, message, label, timestamp }) => {
    const l = level;
    level = colorize.colorize(l, level.toUpperCase());
    const pre = colorize.colorize(l, `[${label}] ${process.pid}`);
    message = colorize.colorize('cyan', message);
    timestamp = colorize.colorize('magenta', timestamp);
    return `${pre} - ${timestamp}\t${level}: ${message}`;
  },
);

const logFormat = winston.format.printf(
  ({ level, message, label, timestamp }) => {
    return `[${label}] ${
      process.pid
    } - ${timestamp}\t${level.toUpperCase()}: ${message}`;
  },
);

const timeFormat = winston.format.timestamp({
  format: 'YYYY-MM-DD HH:mm:ss',
});

export function createLoggerOptions(prefix: string) {
  return {
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.label({ label: prefix }),
          timeFormat,
          logFormatColorful,
        ),
      }),
      new winston.transports.DailyRotateFile({
        dirname: `logs`, // 日志保存的目录
        filename: prefix + '-%DATE%.combined.log', // 日志名称，占位符 %DATE% 取值为 datePattern 值。
        datePattern: 'YYYY-MM-DD', // 日志轮换的频率，此处表示每天。
        zippedArchive: true, // 是否通过压缩的方式归档被轮换的日志文件。
        maxSize: '20m',
        maxFiles: '14d', // 保留日志文件的最大天数，此处表示自动删除超过 14 天的日志文件。
        // 记录时添加时间戳信息
        format: winston.format.combine(
          winston.format.label({ label: prefix }),
          timeFormat,
          logFormat,
        ),
      }),
      new winston.transports.DailyRotateFile({
        level: 'error',
        dirname: `logs`, // 日志保存的目录
        filename: prefix + '-%DATE%.error.log', // 日志名称，占位符 %DATE% 取值为 datePattern 值。
        datePattern: 'YYYY-MM-DD', // 日志轮换的频率，此处表示每天。
        zippedArchive: true, // 是否通过压缩的方式归档被轮换的日志文件。
        maxSize: '20m',
        maxFiles: '14d', // 保留日志文件的最大天数，此处表示自动删除超过 14 天的日志文件。
        // 记录时添加时间戳信息
        format: winston.format.combine(
          winston.format.label({ label: prefix }),
          timeFormat,
          logFormat,
        ),
      }),
    ],
  };
}

/**
 * 创建引导程序
 * @param serviceName
 * @param module
 */
export function createBootstrap(serviceName: string, module: any) {
  return async () => {
    const application = await NestFactory.create(module, {
      logger: WinstonModule.createLogger({
        instance: createLogger({ ...createLoggerOptions('App') }),
      }),
    });
    //全局异常处理
    application.useGlobalFilters(new HttpExceptionFilter());
    //跨域
    application.enableCors();
    //校验
    application.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        exceptionFactory: (errors) => {
          //重写错误返回
          const err = errors[0];
          const constraints =
            err.constraints![Object.keys(err.constraints!)[0]];
          return new ServiceException(`${constraints}`);
        },
      }),
    );

    const configService = application.get(ConfigService);

    //swagger
    const config = new DocumentBuilder()
      .setTitle(`${serviceName} API`)
      .setDescription(`${serviceName} Docs`)
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(application, config);
    SwaggerModule.setup('api', application, document);

    await application.listen(configService.get<number>('server.port')!, () => {
      Logger.log(
        `API Served On http://127.0.0.1:${configService.get<number>(
          'server.port',
        )!}`,
      );
      Logger.log(
        `API Docs On http://127.0.0.1:${configService.get<number>(
          'server.port',
        )!}/api`,
      );
    });
  };
}
