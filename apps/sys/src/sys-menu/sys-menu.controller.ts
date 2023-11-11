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
import { SysMenuService } from './sys-menu.service';
import { CreateSysMenuDto } from './dto/create-sys-menu.dto';
import { UpdateSysMenuDto } from './dto/update-sys-menu.dto';
import { ApiTags } from '@codecoderun/swagger';
import { AutoVo, VoType } from '@happykit/common/decorator/vo.decorator';
import { SysMenuVo } from './vo/sys-menu.vo';
import { ServiceException } from '@happykit/common/error';
import { BizLog } from '@happykit/common/decorator/log.decorator';

@Controller('sys-menu')
@ApiTags('菜单权限')
export class SysMenuController {
  constructor(private readonly sysMenuService: SysMenuService) {}

  /**
   * 创建菜单权限
   */
  @Post()
  @AutoVo({ type: SysMenuVo })
  @BizLog({ name: '菜单权限', desc: '创建菜单权限' })
  async create(@Body() createSysMenuDto: CreateSysMenuDto) {
    return await this.sysMenuService.create(createSysMenuDto);
  }

  /**
   * 菜单权限分页
   */
  @Get()
  @AutoVo({ type: SysMenuVo, voType: VoType.PAGE })
  @BizLog({ name: '菜单权限', desc: '查询菜单权限分页' })
  async findPage(
    @Query('pageNo') pageNo: number,
    @Query('pageSize') pageSize: number,
  ) {
    return await this.sysMenuService.findPage(
      {},
      {
        pageNo,
        pageSize,
      },
    );
  }

  /**
   * 菜单权限详情
   */
  @Get(':id')
  @AutoVo({ type: SysMenuVo })
  @BizLog({ name: '菜单权限', desc: '查询菜单权限详情' })
  async findOne(@Param('id') id: string) {
    const data = await this.sysMenuService.findById(id);
    if (!data) {
      throw new ServiceException('数据未找到');
    }
    return data;
  }

  /**
   * 更新菜单权限
   */
  @Patch(':id')
  @AutoVo({ type: SysMenuVo })
  @BizLog({ name: '菜单权限', desc: '更新菜单权限' })
  async update(
    @Param('id') id: string,
    @Body() updateSysMenuDto: UpdateSysMenuDto,
  ) {
    return await this.sysMenuService.updateOne({ id }, updateSysMenuDto);
  }

  /**
   * 删除菜单权限
   */
  @Delete(':id')
  @AutoVo({ type: SysMenuVo })
  @BizLog({ name: '菜单权限', desc: '删除菜单权限' })
  async remove(@Param('id') id: string) {
    return await this.sysMenuService.deleteById(id);
  }
}
