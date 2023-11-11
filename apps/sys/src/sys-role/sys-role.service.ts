import { Injectable } from '@nestjs/common';
import { BaseService } from '@happykit/common/base/base.service';
import { SysRole } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class SysRoleService extends BaseService<SysRole> {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  protected get model() {
    return this.prisma.sysRole;
  }
}
