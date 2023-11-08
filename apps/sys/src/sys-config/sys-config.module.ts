import { Module } from '@nestjs/common';
import { SysConfigService } from './sys-config.service';
import { SysConfigController } from './sys-config.controller';

@Module({
  controllers: [SysConfigController],
  providers: [SysConfigService],
})
export class SysConfigModule {}
