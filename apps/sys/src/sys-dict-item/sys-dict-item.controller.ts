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
import { SysDictItemService } from './sys-dict-item.service';
import { CreateSysDictItemDto } from './dto/create-sys-dict-item.dto';
import { UpdateSysDictItemDto } from './dto/update-sys-dict-item.dto';
import { ApiTags } from '@codecoderun/swagger';
import { AutoVo, VoType } from '@happykit/common/decorator/vo.decorator';
import { SysDictItemVo } from './vo/sys-dict-item.vo';
import { ServiceException } from '@happykit/common/error';
import { BizLog } from '@happykit/common/decorator/log.decorator';

@Controller('sys-dict-item')
@ApiTags('字典项')
export class SysDictItemController {
  constructor(private readonly sysDictItemService: SysDictItemService) {}

  /**
   * 创建字典项
   */
  @Post()
  @AutoVo({ type: SysDictItemVo })
  @BizLog({ name: '字典项', desc: '创建字典项' })
  async create(@Body() createSysDictItemDto: CreateSysDictItemDto) {
    return await this.sysDictItemService.create(createSysDictItemDto);
  }

  /**
   * 字典项分页
   */
  @Get()
  @AutoVo({ type: SysDictItemVo, voType: VoType.PAGE })
  @BizLog({ name: '字典项', desc: '查询字典项分页' })
  async findPage(
    @Query('pageNo') pageNo: number,
    @Query('pageSize') pageSize: number,
  ) {
    return await this.sysDictItemService.findPage(
      {},
      {
        pageNo,
        pageSize,
      },
    );
  }

  /**
   * 字典项详情
   */
  @Get(':id')
  @AutoVo({ type: SysDictItemVo })
  @BizLog({ name: '字典项', desc: '查询字典项详情' })
  async findOne(@Param('id') id: string) {
    const data = await this.sysDictItemService.findById(id);
    if (!data) {
      throw new ServiceException('数据未找到');
    }
    return data;
  }

  /**
   * 更新字典项
   */
  @Patch(':id')
  @AutoVo({ type: SysDictItemVo })
  @BizLog({ name: '字典项', desc: '更新字典项' })
  async update(
    @Param('id') id: string,
    @Body() updateSysDictItemDto: UpdateSysDictItemDto,
  ) {
    return await this.sysDictItemService.updateOne(
      { id },
      updateSysDictItemDto,
    );
  }

  /**
   * 删除字典项
   */
  @Delete(':id')
  @AutoVo({ type: SysDictItemVo })
  @BizLog({ name: '字典项', desc: '删除字典项' })
  async remove(@Param('id') id: string) {
    return await this.sysDictItemService.deleteById(id);
  }
}
