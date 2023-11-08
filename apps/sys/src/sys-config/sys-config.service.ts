import { Injectable } from '@nestjs/common';
import { BaseService } from '@happykit/common/base/base.service';
import { SysConfig } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
@Injectable()
export class SysConfigService extends BaseService<SysConfig> {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  protected get model() {
    return this.prisma.sysConfig;
  }
}
