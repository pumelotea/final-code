import { Injectable } from '@nestjs/common';
import { BaseService } from '@happykit/common/base/base.service';
import { SysDictItem } from '@prisma/client';
import { PrismaService } from '@happykit/common/prisma/prisma.service';

@Injectable()
export class SysDictItemService extends BaseService<SysDictItem> {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  protected get model() {
    return this.prisma.sysDictItem;
  }
}
