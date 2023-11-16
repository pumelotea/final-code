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
  async bindMenu(roleId: string, menuIds: string[]) {
    const role = await this.findById(roleId);
    if (!role) {
      throw new ServiceException('角色不存在');
    }
    await this.prisma.sysRoleMenu.deleteMany({
      where: {
        roleId,
      },
    });
    const list = [];
    for (const menuId of menuIds) {
      list.push({
        roleId,
        menuId,
      });
    }
    await this.prisma.sysRoleMenu.createMany({
      data: list,
    });
    return role;
  }

  async findMenuIds(roleId: string) {
    const list = await this.prisma.sysRoleMenu.findMany({
      where: {
        deleted: null,
        roleId,
      },
    });
    return {
      menuIds: list.map((e) => e.menuId),
    };
  }

  protected get model() {
    return this.prisma.sysRole;
  }
}
