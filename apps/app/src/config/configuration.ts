import ConfigDev from './config.dev';
import ConfigLocal from './config.local';
import ConfigProd from './config.prod';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'nestjs-prisma';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JWtOption, MySQLOption, RedisOption } from '@happykit/common';
import { RedisModule } from '@songkeys/nestjs-redis';
import * as process from 'process';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import { FileModule } from '@happykit/common/file/file.module';
import { FileModuleOptions } from '@happykit/common/file/file.module-definition';

/**
 * 多环境配置
 */
let runtimesConfig = ConfigLocal;
switch (process.env.mode) {
  case 'local':
    runtimesConfig = ConfigLocal;
    break;
  case 'dev':
    runtimesConfig = ConfigDev;
    break;
  case 'prod':
    runtimesConfig = ConfigProd;
}
const options = () => {
  return runtimesConfig;
};

/**
 * 配置模块
 */
export const configModule = ConfigModule.forRoot({
  isGlobal: true,
  load: [options],
});

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
 * mysql orm模块
 */
export const prismaModule = PrismaModule.forRootAsync({
  inject: [ConfigService],
  isGlobal: true,
  useFactory(configService: ConfigService) {
    const mySQLOption = configService.get<MySQLOption>('mysql.client')!;
    return { prismaOptions: { datasourceUrl: mySQLOption.datasourceUrl } };
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

const labelFormat = winston.format.label({ label: 'Application' });
const timeFormat = winston.format.timestamp({
  format: 'YYYY-MM-DD HH:mm:ss',
});

export const loggerOptions = {
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        labelFormat,
        timeFormat,
        logFormatColorful,
      ),
    }),
    new winston.transports.DailyRotateFile({
      dirname: `logs`, // 日志保存的目录
      filename: '%DATE%.combined.log', // 日志名称，占位符 %DATE% 取值为 datePattern 值。
      datePattern: 'YYYY-MM-DD', // 日志轮换的频率，此处表示每天。
      zippedArchive: true, // 是否通过压缩的方式归档被轮换的日志文件。
      maxSize: '20m',
      maxFiles: '14d', // 保留日志文件的最大天数，此处表示自动删除超过 14 天的日志文件。
      // 记录时添加时间戳信息
      format: winston.format.combine(labelFormat, timeFormat, logFormat),
    }),
    new winston.transports.DailyRotateFile({
      level: 'error',
      dirname: `logs`, // 日志保存的目录
      filename: '%DATE%.error.log', // 日志名称，占位符 %DATE% 取值为 datePattern 值。
      datePattern: 'YYYY-MM-DD', // 日志轮换的频率，此处表示每天。
      zippedArchive: true, // 是否通过压缩的方式归档被轮换的日志文件。
      maxSize: '20m',
      maxFiles: '14d', // 保留日志文件的最大天数，此处表示自动删除超过 14 天的日志文件。
      // 记录时添加时间戳信息
      format: winston.format.combine(labelFormat, timeFormat, logFormat),
    }),
  ],
};
