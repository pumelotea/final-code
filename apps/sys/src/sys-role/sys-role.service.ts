import { Injectable } from '@nestjs/common';
import { BaseService } from '@happykit/common/base/base.service';
import { SysRole } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { ServiceException } from '@happykit/common/error';

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

  protected get model() {
    return this.prisma.sysRole;
  }
}
