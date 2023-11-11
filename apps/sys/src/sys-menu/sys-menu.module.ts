import { Module } from '@nestjs/common';
import { SysMenuService } from './sys-menu.service';
import { SysMenuController } from './sys-menu.controller';

@Module({
  controllers: [SysMenuController],
  providers: [SysMenuService],
})
export class SysMenuModule {}
