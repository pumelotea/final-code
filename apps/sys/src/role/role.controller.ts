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
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ApiTags } from '@codecoderun/swagger';
import { AutoVo, VoType } from '@happykit/common/decorator/vo.decorator';
import { RoleVo } from './vo/role.vo';
import { ServiceException } from '@happykit/common/error';
import { BizLog } from '@happykit/common/decorator/log.decorator';

@Controller('role')
@ApiTags('角色')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  /**
   * 创建角色
   */
  @Post()
  @AutoVo({ type: RoleVo })
  @BizLog({ name: '角色', desc: '创建角色' })
  async create(@Body() createRoleDto: CreateRoleDto) {
    return await this.roleService.create(createRoleDto);
  }

  /**
   * 角色分页
   */
  @Get()
  @AutoVo({ type: RoleVo, voType: VoType.PAGE })
  @BizLog({ name: '角色', desc: '查询角色分页' })
  async findPage(
    @Query('pageNo') pageNo: number,
    @Query('pageSize') pageSize: number,
  ) {
    return await this.roleService.findPage(
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
  @AutoVo({ type: RoleVo })
  @BizLog({ name: '角色', desc: '查询角色详情' })
  async findOne(@Param('id') id: string) {
    const data = await this.roleService.findById(id);
    if (!data) {
      throw new ServiceException('数据未找到');
    }
    return data;
  }

  /**
   * 更新角色
   */
  @Patch(':id')
  @AutoVo({ type: RoleVo })
  @BizLog({ name: '角色', desc: '更新角色' })
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return await this.roleService.updateOne({ id }, updateRoleDto);
  }

  /**
   * 删除角色
   */
  @Delete(':id')
  @AutoVo({ type: RoleVo })
  @BizLog({ name: '角色', desc: '删除角色' })
  async remove(@Param('id') id: string) {
    return await this.roleService.deleteById(id);
  }
}
