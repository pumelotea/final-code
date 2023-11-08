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
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ApiTags } from '@codecoderun/swagger';
import { RoleVo } from './vo/role.vo';
import { AutoVo, VoType } from '@happykit/common/decorator/vo.decorator';
import { RolePageVo } from './vo/role-page.vo';

@Controller('role')
@ApiTags('系统角色')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}
  /**
   * 创建角色
   * @param createRoleDto
   * @
   */
  @Post()
  @AutoVo({ type: RoleVo })
  async create(@Body() createRoleDto: CreateRoleDto) {
    return await this.roleService.create(createRoleDto);
  }

  /**
   * 角色分页查询
   * @param pageNo
   * @param pageSize
   */
  @Get()
  @AutoVo({ type: RolePageVo, voType: VoType.PAGE })
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

  @Get(':id')
  @AutoVo({ type: RoleVo })
  async findOne(@Param('id') id: string) {
    return await this.roleService.findOne({ id }, {});
  }

  @Patch(':id')
  @AutoVo({ type: RoleVo })
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return await this.roleService.updateOne({ id }, updateRoleDto);
  }

  @Delete(':id')
  @AutoVo({ type: RoleVo })
  async remove(@Param('id') id: string) {
    return await this.roleService.deleteById(id);
  }
}
