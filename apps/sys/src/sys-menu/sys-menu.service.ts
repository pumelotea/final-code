import { Injectable } from '@nestjs/common';
import { BaseService } from '@happykit/common/base/base.service';
import { SysMenu } from '@prisma/client';
import { PrismaService } from '@happykit/common/prisma/prisma.service';
import { SysMenuTreeVo } from './vo/sys-menu-tree.vo';
import { SysMenuVo } from './vo/sys-menu.vo';
import { ServiceException } from '@happykit/common/error';

@Injectable()
export class SysMenuService extends BaseService<SysMenu> {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  protected get model() {
    return this.prisma.sysMenu;
  }

  async getMenuTree(): Promise<SysMenuTreeVo[]> {
    const dataList = await this.model.findMany({
      where: { deleted: null },
      orderBy: {
        orderNo: 'asc',
      },
    });
    const rootList = dataList
      .filter((e) => e.parentId === '0' && e.type === 'menu')
      .map((e) => Object.assign(new SysMenuTreeVo(), e));

    const forEach = (parentId: string) => {
      const childList = dataList.filter((e) => e.parentId === parentId);
      if (childList.length === 0) {
        return childList;
      }
      const treeList: any[] = [];
      childList.forEach((node) => {
        const childList = forEach(node.id);
        treeList.push({
          node: Object.assign(new SysMenuVo(), node),
          children: childList,
        });
      });
      return treeList;
    };

    const treeList: any[] = [];
    rootList.forEach((rootNode) => {
      const childList = forEach(rootNode.id);
      treeList.push({
        node: Object.assign(new SysMenuVo(), rootNode),
        children: childList,
      });
    });

    return treeList;
  }

  async deleteById(id: string) {
    const menu = await super.deleteById(id);
    if (!menu) {
      throw new ServiceException('菜单未找到');
    }
    await this.prisma.sysRoleMenu.deleteMany({
      where: {
        deleted: null,
        menuId: menu.id,
      },
    });
    return menu;
  }

  sortMenu() {}
}
