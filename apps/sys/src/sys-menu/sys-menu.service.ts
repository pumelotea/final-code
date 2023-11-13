import { Injectable } from '@nestjs/common';
import { BaseService } from '@happykit/common/base/base.service';
import { SysMenu } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { SysMenuTreeVo } from './vo/sys-menu-tree.vo';
import { SysMenuVo } from './vo/sys-menu.vo';

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
}
