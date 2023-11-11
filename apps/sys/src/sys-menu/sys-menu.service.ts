import { Injectable } from '@nestjs/common';
import { BaseService } from '@happykit/common/base/base.service';
import { SysMenu } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class SysMenuService extends BaseService<SysMenu> {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  protected get model() {
    return this.prisma.sysMenu;
  }
}
