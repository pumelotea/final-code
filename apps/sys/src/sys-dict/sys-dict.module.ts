import { Module } from '@nestjs/common';
import { SysDictService } from './sys-dict.service';
import { SysDictController } from './sys-dict.controller';

@Module({
  controllers: [SysDictController],
  providers: [SysDictService],
})
export class SysDictModule {}
