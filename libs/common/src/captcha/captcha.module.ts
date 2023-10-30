import { DynamicModule, Global, Module } from '@nestjs/common';
import {
  ConfigurableModuleClass,
  ASYNC_OPTIONS_TYPE,
  OPTIONS_TYPE,
} from '@happykit/common/captcha/captcha.module-definition';
import { CaptchaController } from '@happykit/common/captcha/captcha.controller';
import { CaptchaService } from '@happykit/common/captcha/captcha.service';

@Module({
  controllers: [CaptchaController],
  providers: [CaptchaService],
  exports: [CaptchaService],
})
@Global()
export class CaptchaModule extends ConfigurableModuleClass {
  static register(options: typeof OPTIONS_TYPE): DynamicModule {
    return {
      // your custom logic here
      ...super.register(options),
    };
  }

  static registerAsync(options: typeof ASYNC_OPTIONS_TYPE): DynamicModule {
    return {
      // your custom logic here
      ...super.registerAsync(options),
    };
  }
}
