import { Module } from '@nestjs/common';
import { SysDictItemService } from './sys-dict-item.service';
import { SysDictItemController } from './sys-dict-item.controller';

@Module({
  controllers: [SysDictItemController],
  providers: [SysDictItemService],
})
export class SysDictItemModule {}
