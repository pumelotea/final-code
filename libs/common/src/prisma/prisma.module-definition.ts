import { ConfigurableModuleBuilder } from '@nestjs/common';

export interface PrismaModuleOptions {
  databaseUrl: string;
}

export const {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
  OPTIONS_TYPE,
  ASYNC_OPTIONS_TYPE,
} = new ConfigurableModuleBuilder<PrismaModuleOptions>().build();
