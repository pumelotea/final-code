import { ConfigurableModuleBuilder } from '@nestjs/common';

export interface CaptchaModuleOptions {
  isGlobal: boolean;
}

export const {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
  OPTIONS_TYPE,
  ASYNC_OPTIONS_TYPE,
} = new ConfigurableModuleBuilder<CaptchaModuleOptions>().build();

export interface CaptchaGenerateResult {
  data: string;
  text: string;
  id: string;
}
