import { ConfigurableModuleBuilder } from '@nestjs/common';
import { Readable as ReadableStream } from 'node:stream';

export interface FileModuleOptions {
  fileSize: '100mb';
  // whitelist: string[]，文件扩展名白名单
  whitelist: string[];
  // 本地目录
  targetDir: string;
  // 可用存储桶列表，防止乱创建
  bucketList: string[];
  // 启用匿名访问图片模式
  anonymousAccess: boolean;
  // STORAGE 存储引擎
  storage: string; // LOCAL MINIO
  // 自定义配置
  extra?: any;
}

export interface MinioOptions {
  endPoint: string;
  port: number;
  accessKey: string;
  secretKey: string;
  useSSL: boolean;
}

export const {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
  OPTIONS_TYPE,
  ASYNC_OPTIONS_TYPE,
} = new ConfigurableModuleBuilder<FileModuleOptions>().build();

export declare interface CommonFileService {
  fileConfig: FileModuleOptions;
  upload(files: Express.Multer.File, bucket: string): Promise<string> | string;
  view(bucket: string, filename: string): Promise<Buffer | ReadableStream>;
}
