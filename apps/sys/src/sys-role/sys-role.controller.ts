import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { SysRoleService } from './sys-role.service';
import { CreateSysRoleDto } from './dto/create-sys-role.dto';
import { UpdateSysRoleDto } from './dto/update-sys-role.dto';
import { ApiTags } from '@codecoderun/swagger';
import { AutoVo, VoType } from '@happykit/common/decorator/vo.decorator';
import { SysRoleVo } from './vo/sys-role.vo';
import { ServiceException } from '@happykit/common/error';
import { BizLog } from '@happykit/common/decorator/log.decorator';
import { BindMenuDto } from './dto/bind-menu.dto';
import { SysRoleMenuIdsVo } from './vo/sys-role-menu-ids.vo';

@Controller('sys-role')
@ApiTags('角色')
export class SysRoleController {
  constructor(private readonly sysRoleService: SysRoleService) {}

  /**
   * 创建角色
   */
  @Post()
  @AutoVo({ type: SysRoleVo })
  @BizLog({ name: '角色', desc: '创建角色' })
  async create(@Body() createSysRoleDto: CreateSysRoleDto) {
    return await this.sysRoleService.create(createSysRoleDto);
  }

  /**
   * 角色分页
   */
  @Get()
  @AutoVo({ type: SysRoleVo, voType: VoType.PAGE })
  @BizLog({ name: '角色', desc: '查询角色分页' })
  async findPage(
    @Query('pageNo') pageNo: number,
    @Query('pageSize') pageSize: number,
  ) {
    return await this.sysRoleService.findPage(
      {},
      {
        pageNo,
        pageSize,
      },
    );
  }

  /**
   * 角色详情
   */
  @Get(':id')
  @AutoVo({ type: SysRoleVo })
  @BizLog({ name: '角色', desc: '查询角色详情' })
  async findOne(@Param('id') id: string) {
    const data = await this.sysRoleService.findById(id);
    if (!data) {
      throw new ServiceException('数据未找到');
    }
    return data;
  }

  /**
   * 更新角色
   */
  @Patch(':id')
  @AutoVo({ type: SysRoleVo })
  @BizLog({ name: '角色', desc: '更新角色' })
  async update(
    @Param('id') id: string,
    @Body() updateSysRoleDto: UpdateSysRoleDto,
  ) {
    return await this.sysRoleService.updateOne({ id }, updateSysRoleDto);
  }

  /**
   * 删除角色
   */
  @Delete(':id')
  @AutoVo({ type: SysRoleVo })
  @BizLog({ name: '角色', desc: '删除角色' })
  async remove(@Param('id') id: string) {
    return await this.sysRoleService.deleteById(id);
  }

  /**
   * 绑定菜单
   * @param id
   * @param bindMenuDto
   */
  @Post('/:id/bind/menu')
  @AutoVo({ type: SysRoleVo })
  @BizLog({ name: '角色', desc: '绑定菜单' })
  async bindMenu(@Param('id') id: string, @Body() bindMenuDto: BindMenuDto) {
    const menuIds = Array.from(new Set(bindMenuDto.menuIds));
    return await this.sysRoleService.bindMenu(id, menuIds);
  }

  /**
   * 查找角色对应的菜单
   * @param roleId
   */
  @Get('/menu/ids')
  @AutoVo({ type: SysRoleMenuIdsVo })
  @BizLog({ name: '角色', desc: '获取菜单' })
  findMenuIds(@Query('roleId') roleId: string) {
    return this.sysRoleService.findMenuIds(roleId);
  }
}
