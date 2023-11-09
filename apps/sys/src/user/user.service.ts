import { Injectable } from '@nestjs/common';
import { BaseService } from '@happykit/common/base/base.service';
import { User } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  protected get model() {
    return this.prisma.user;
  }
}
