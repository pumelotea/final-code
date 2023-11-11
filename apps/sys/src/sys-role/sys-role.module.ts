import { Module } from '@nestjs/common';
import { SysRoleService } from './sys-role.service';
import { SysRoleController } from './sys-role.controller';

@Module({
  controllers: [SysRoleController],
  providers: [SysRoleService],
})
export class SysRoleModule {}
