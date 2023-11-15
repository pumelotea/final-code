import { DynamicModule, Global, Module } from '@nestjs/common';
import { PrismaService } from '@happykit/common/prisma/prisma.service';
import {
  ASYNC_OPTIONS_TYPE,
  ConfigurableModuleClass,
  OPTIONS_TYPE,
} from '@happykit/common/prisma/prisma.module-definition';

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
@Global()
export class PrismaModule extends ConfigurableModuleClass {
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
