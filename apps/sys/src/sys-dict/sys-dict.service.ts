import { Injectable } from '@nestjs/common';
import { BaseService } from '@happykit/common/base/base.service';
import { SysDict } from '@prisma/client';
import { PrismaService } from '@happykit/common/prisma/prisma.service';

@Injectable()
export class SysDictService extends BaseService<SysDict> {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  protected get model() {
    return this.prisma.sysDict;
  }
}
