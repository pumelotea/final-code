import { DynamicModule, Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import {
  ASYNC_OPTIONS_TYPE,
  ConfigurableModuleClass,
  OPTIONS_TYPE,
} from '@happykit/common/file/file.module-definition';
import { MinioService } from '@happykit/common/file/minio.service';

@Module({
  controllers: [FileController],
  providers: [FileService, MinioService],
})
export class FileModule extends ConfigurableModuleClass {
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
