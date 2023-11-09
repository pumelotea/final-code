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
import { SysConfigService } from './sys-config.service';
import { CreateSysConfigDto } from './dto/create-sys-config.dto';
import { UpdateSysConfigDto } from './dto/update-sys-config.dto';
import { ApiTags } from '@codecoderun/swagger';
import { AutoVo, VoType } from '@happykit/common/decorator/vo.decorator';
import { SysConfigVo } from './vo/sys-config.vo';
import { ServiceException } from '@happykit/common/error';
import { Public } from '@happykit/common/decorator/public.decorator';

@Controller('sys-config')
@ApiTags('系统配置')
export class SysConfigController {
  constructor(private readonly sysConfigService: SysConfigService) {}

  /**
   * 创建配置
   * @param createSysConfigDto
   */
  @Post()
  @Public()
  @AutoVo({ type: SysConfigVo })
  async create(@Body() createSysConfigDto: CreateSysConfigDto) {
    return await this.sysConfigService.create(createSysConfigDto);
  }

  /**
   * 配置分页
   * @param pageNo
   * @param pageSize
   */
  @Get()
  @AutoVo({ type: SysConfigVo, voType: VoType.PAGE })
  async findPage(
    @Query('pageNo') pageNo: number,
    @Query('pageSize') pageSize: number,
  ) {
    return await this.sysConfigService.findPage(
      {},
      {
        pageNo,
        pageSize,
      },
    );
  }

  /**
   * 配置详情
   * @param id
   */
  @Get(':id')
  @AutoVo({ type: SysConfigVo })
  async findOne(@Param('id') id: string) {
    const data = await this.sysConfigService.findById(id);
    if (!data) {
      throw new ServiceException('数据未找到');
    }
    return data;
  }

  /**
   * 更新配置
   * @param id
   * @param updateSysConfigDto
   */
  @Patch(':id')
  @AutoVo({ type: SysConfigVo })
  async update(
    @Param('id') id: string,
    @Body() updateSysConfigDto: UpdateSysConfigDto,
  ) {
    return await this.sysConfigService.updateOne({ id }, updateSysConfigDto);
  }

  /**
   * 删除配置
   * @param id
   */
  @Delete(':id')
  @AutoVo({ type: SysConfigVo })
  async remove(@Param('id') id: string) {
    return await this.sysConfigService.deleteById(id);
  }
}
