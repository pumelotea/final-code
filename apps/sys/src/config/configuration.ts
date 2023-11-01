import ConfigDev from './config.dev';
import ConfigLocal from './config.local';
import ConfigProd from './config.prod';
import { ConfigModule } from '@nestjs/config';
import * as process from 'process';
import 'winston-daily-rotate-file';

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

export * from '@happykit/common/config/configuration';
