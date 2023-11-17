import { Global, Module } from '@nestjs/common';
import { SysMenuService } from './sys-menu.service';
import { SysMenuController } from './sys-menu.controller';

@Module({
  controllers: [SysMenuController],
  providers: [SysMenuService],
  exports: [SysMenuService],
})
@Global()
export class SysMenuModule {}
