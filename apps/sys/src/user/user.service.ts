import { Injectable } from '@nestjs/common';
import { BaseService } from '@happykit/common/base/base.service';
import { User } from '@prisma/client';
import { PrismaService } from '@happykit/common/prisma/prisma.service';
import { LoginDto } from '../../../app/src/user/dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ServiceException } from '@happykit/common/error';
import { Transaction } from '@happykit/common/decorator/transaction.decorator';
import { SysRoleVo } from '../sys-role/vo/sys-role.vo';
import { SysMenuTreeVo } from '../sys-menu/vo/sys-menu-tree.vo';
import { SysMenuVo } from '../sys-menu/vo/sys-menu.vo';
import { SysMenuService } from '../sys-menu/sys-menu.service';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly sysMenuService: SysMenuService,
  ) {
    super();
  }

  protected get model() {
    return this.prisma.user;
  }

  async create(data: Partial<User>): Promise<User> {
    const saltRounds = 10;
    data.password = await new Promise<string>((resolve, reject) => {
      bcrypt.hash(data.password || '', saltRounds, function (err, hash) {
        // Store hash in your password DB.
        if (err) {
          reject(err);
          return;
        }
        resolve(hash);
      });
    });
    return super.create(data);
  }

  async signIn(loginDto: LoginDto) {
    const user = await this.findOne(
      {
        username: loginDto.username,
      },
      {},
    );

    if (!user) {
      throw new ServiceException('用户未找到');
    }

    const isOk = await new Promise((resolve, reject) => {
      bcrypt.compare(
        loginDto.password,
        user.password || '',
        function (err, result) {
          // result == true
          if (err) {
            reject(err);
            return;
          }
          resolve(result);
        },
      );
    });

    if (!isOk) {
      throw new ServiceException('账号密码验证失败');
    }
    const token = this.jwtService.sign({
      ...user,
    });
    //
    if (!token) {
      throw new ServiceException('颁发授权token失败');
    }
    return {
      token,
      ...user,
    };
  }

  signOut(userId: string) {
    return userId;
  }

  @Transaction()
  async bindRoles(userId: string, ids: string[]) {
    const user = await this.findById(userId);
    if (!user) {
      throw new ServiceException('用户不存在');
    }
    await this.prisma.sysRoleUser.deleteMany({
      where: {
        userId,
      },
    });
    const list = [];
    for (const roleId of ids) {
      list.push({
        userId,
        roleId,
        authType: 'sys',
      });
    }
    await this.prisma.sysRoleUser.createMany({
      data: list,
    });
    return user;
  }

  async findRoles(userId: string) {
    return this.prisma.$queryRaw<SysRoleVo[]>`select a.* from sysRole as a left 
    join sysRoleUser as b on a.id = b.roleId where b.userId = ${userId} and a.deleted is null and b.deleted is null`;
  }

  async findUserMenus(userId: string): Promise<SysMenuTreeVo[]> {
    const list = await this.prisma.sysRoleUser.findMany({
      where: {
        userId,
        deleted: null,
      },
    });

    const roleIds = list.map((e) => e.roleId);
    const menuIds = await this.prisma.sysRoleMenu.findMany({
      select: {
        menuId: true,
      },
      where: {
        deleted: null,
        roleId: {
          in: roleIds,
        },
      },
      distinct: 'menuId',
    });

    const dataList = await this.prisma.sysMenu.findMany({
      where: {
        deleted: null,
        id: {
          in: menuIds.map((e) => e.menuId),
        },
      },
      orderBy: {
        orderNo: 'asc',
      },
    });
    return this.sysMenuService.buildTree(dataList);
  }
}
