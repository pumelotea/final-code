import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import {
  PrismaModuleOptions,
  MODULE_OPTIONS_TOKEN,
} from '@happykit/common/prisma/prisma.module-definition';
import { PrismaMiddleware } from '@happykit/common/prisma/prisma.middleware';
import { PrismaTxExtend } from '@happykit/common/prisma/prisma.extend';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private txClient;
  constructor(
    @Inject(MODULE_OPTIONS_TOKEN) private options: PrismaModuleOptions,
  ) {
    super({
      datasourceUrl: options.databaseUrl,
    });
    //todo  优化
    this.$use(PrismaMiddleware);
    this.txClient = this.$extends(PrismaTxExtend);
  }
  async onModuleInit() {
    await this.$connect();
  }

  startTransaction() {
    return this.txClient.$begin();
  }
}
