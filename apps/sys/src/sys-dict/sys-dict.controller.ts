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
import { SysDictService } from './sys-dict.service';
import { CreateSysDictDto } from './dto/create-sys-dict.dto';
import { UpdateSysDictDto } from './dto/update-sys-dict.dto';
import { ApiTags } from '@codecoderun/swagger';
import { AutoVo, VoType } from '@happykit/common/decorator/vo.decorator';
import { SysDictVo } from './vo/sys-dict.vo';
import { ServiceException } from '@happykit/common/error';
import { BizLog } from '@happykit/common/decorator/log.decorator';

@Controller('sys-dict')
@ApiTags('字典')
export class SysDictController {
  constructor(private readonly sysDictService: SysDictService) {}

  /**
   * 创建字典
   */
  @Post()
  @AutoVo({ type: SysDictVo })
  @BizLog({ name: '字典', desc: '创建字典' })
  async create(@Body() createSysDictDto: CreateSysDictDto) {
    return await this.sysDictService.create(createSysDictDto);
  }

  /**
   * 字典分页
   */
  @Get()
  @AutoVo({ type: SysDictVo, voType: VoType.PAGE })
  @BizLog({ name: '字典', desc: '查询字典分页' })
  async findPage(
    @Query('pageNo') pageNo: number,
    @Query('pageSize') pageSize: number,
  ) {
    return await this.sysDictService.findPage(
      {},
      {
        pageNo,
        pageSize,
      },
    );
  }

  /**
   * 字典详情
   */
  @Get(':id')
  @AutoVo({ type: SysDictVo })
  @BizLog({ name: '字典', desc: '查询字典详情' })
  async findOne(@Param('id') id: string) {
    const data = await this.sysDictService.findById(id);
    if (!data) {
      throw new ServiceException('数据未找到');
    }
    return data;
  }

  /**
   * 更新字典
   */
  @Patch(':id')
  @AutoVo({ type: SysDictVo })
  @BizLog({ name: '字典', desc: '更新字典' })
  async update(
    @Param('id') id: string,
    @Body() updateSysDictDto: UpdateSysDictDto,
  ) {
    return await this.sysDictService.updateOne({ id }, updateSysDictDto);
  }

  /**
   * 删除字典
   */
  @Delete(':id')
  @AutoVo({ type: SysDictVo })
  @BizLog({ name: '字典', desc: '删除字典' })
  async remove(@Param('id') id: string) {
    return await this.sysDictService.deleteById(id);
  }

  
}
