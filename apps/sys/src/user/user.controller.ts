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
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@codecoderun/swagger';
import { AutoVo, VoType } from '@happykit/common/decorator/vo.decorator';
import { UserVo } from './vo/user.vo';
import { ServiceException } from '@happykit/common/error';
import { BizLog } from '@happykit/common/decorator/log.decorator';
import { Public } from '@happykit/common/decorator/public.decorator';
import { LoginVo } from './vo/login.vo';
import { LoginDto } from './dto/login.dto';
import { Captcha } from '@happykit/common/decorator/captcha.decorator';

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

  @Post('login')
  @BizLog({ name: '用户', desc: '账号密码登录' })
  @AutoVo({ type: LoginVo })
  @Public()
  @Captcha()
  signIn(@Body() loginDto: LoginDto) {
    return this.userService.signIn(loginDto);
  }
}
