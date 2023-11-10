import { Injectable } from '@nestjs/common';
import { BaseService } from '@happykit/common/base/base.service';
import { Role } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class RoleService extends BaseService<Role> {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  protected get model() {
    return this.prisma.role;
  }
}
