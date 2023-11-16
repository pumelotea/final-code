import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@codecoderun/swagger';
import { AutoVo, Vo, VoType } from '@happykit/common/decorator/vo.decorator';
import { UserVo } from './vo/user.vo';
import { ServiceException } from '@happykit/common/error';
import { BizLog } from '@happykit/common/decorator/log.decorator';
import { LoginVo } from './vo/login.vo';
import { LoginDto } from './dto/login.dto';
import { User } from '@happykit/common/decorator/user.decorator';
import { AuthUserInfo } from '@happykit/common';
import { BindRoleDto } from './dto/bind-role.dto';
import { SysRoleVo } from '../sys-role/vo/sys-role.vo';
import { SysMenuTreeVo } from '../sys-menu/vo/sys-menu-tree.vo';

@Controller('user')
@ApiTags('用户')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * 创建用户
   */
  @Post()
  @AutoVo({ type: UserVo })
  @BizLog({ name: '用户', desc: '创建用户' })
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  /**
   * 用户分页
   */
  @Get()
  @AutoVo({ type: UserVo, voType: VoType.PAGE })
  @BizLog({ name: '用户', desc: '查询用户分页' })
  async findPage(
    @Query('pageNo') pageNo: number,
    @Query('pageSize') pageSize: number,
  ) {
    return await this.userService.findPage(
      {},
      {
        pageNo,
        pageSize,
      },
    );
  }

  /**
   * 用户详情
   */
  @Get(':id')
  @AutoVo({ type: UserVo })
  @BizLog({ name: '用户', desc: '查询用户详情' })
  async findOne(@Param('id') id: string) {
    const data = await this.userService.findById(id);
    if (!data) {
      throw new ServiceException('数据未找到');
    }
    return data;
  }

  /**
   * 获取当前用户信息
   * @param user
   */
  @Get('/current/authed')
  @AutoVo({ type: UserVo })
  @BizLog({ name: '用户', desc: '查询当前用户详情' })
  async getCurrentUser(@User() user: AuthUserInfo) {
    const data = await this.userService.findById(user.id);
    if (!data) {
      throw new ServiceException('数据未找到');
    }
    return data;
  }

  /**
   * 更新用户
   */
  @Patch(':id')
  @AutoVo({ type: UserVo })
  @BizLog({ name: '用户', desc: '更新用户' })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.userService.updateOne({ id }, updateUserDto);
  }

  /**
   * 删除用户
   */
  @Delete(':id')
  @AutoVo({ type: UserVo })
  @BizLog({ name: '用户', desc: '删除用户' })
  async remove(@Param('id') id: string) {
    return await this.userService.deleteById(id);
  }

  /**
   * 用户登录
   * @param loginDto
   */
  @Post('login')
  @BizLog({ name: '用户', desc: '账号密码登录' })
  @AutoVo({ type: LoginVo })
  // @Captcha()
  signIn(@Body() loginDto: LoginDto) {
    return this.userService.signIn(loginDto);
  }

  /**
   * 绑定用户角色
   * @param id
   * @param bindRoleDto
   */
  @Post('/:id/bind/roles')
  @AutoVo({ type: UserVo })
  @BizLog({ name: '用户', desc: '绑定角色' })
  bindRoles(@Param('id') id: string, @Body() bindRoleDto: BindRoleDto) {
    const roleIds = Array.from(new Set(bindRoleDto.roleIds));
    return this.userService.bindRoles(id, roleIds);
  }

  /**
   * 查询绑定用户角色
   * @param id
   */
  @Get('/:id/bind/roles')
  @Vo({ type: SysRoleVo, voType: VoType.LIST })
  @BizLog({ name: '用户', desc: '查找绑定的角色列表' })
  findRoles(@Param('id') id: string) {
    return this.userService.findRoles(id);
  }

  /**
   * 查询用户菜单树
   * @param id
   */
  @Get('/:id/menus')
  @Vo({ type: SysMenuTreeVo, voType: VoType.LIST })
  @BizLog({ name: '用户', desc: '查找用户菜单树' })
  findUserMenus(@Param('id') id: string) {
    return this.userService.findUserMenus(id);
  }

  /**
   * 查询当前登录用户菜单树
   * @param user
   */
  @Get('/authed/menus')
  @Vo({ type: SysMenuTreeVo, voType: VoType.LIST })
  @BizLog({ name: '用户', desc: '查找当前登录用户菜单树' })
  findCurrentUserMenus(@User() user: AuthUserInfo) {
    return this.userService.findUserMenus(user.id);
  }
}
