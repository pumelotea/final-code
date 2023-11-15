import { Injectable } from '@nestjs/common';
import { BaseService } from '@happykit/common/base/base.service';
import { SysRole } from '@prisma/client';
import { ServiceException } from '@happykit/common/error';
import { PrismaService } from '@happykit/common/prisma/prisma.service';
import { Transaction } from '@happykit/common/decorator/transaction.decorator';

@Injectable()
export class SysRoleService extends BaseService<SysRole> {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async deleteById(id: string): Promise<SysRole> {
    const role = await super.deleteById(id);
    if (!role) {
      throw new ServiceException('角色未找到');
    }
    await this.prisma.sysRoleMenu.deleteMany({
      where: {
        deleted: null,
        roleId: id,
      },
    });
    return role;
  }

  @Transaction()
  async test() {
    const data = await this.prisma.sysRole.create({
      data: {
        roleName: 'zzzz',
        roleDesc: 'okokoko',
      },
    });

    await this.prisma.sysConfig.create({
      data: {
        key: 'aaaaa',
        value: 'asjdlajsldajsd',
      },
    });
    // throw new ServiceException('Rollback');
    return data;
  }

  protected get model() {
    return this.prisma.sysRole;
  }
}
