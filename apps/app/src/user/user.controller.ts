import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { LoginDto } from './dto/login.dto';
import { R } from '@happykit/common/result';
import { AuthUserInfo } from '@happykit/common';
import { RedisService } from '@songkeys/nestjs-redis';
import { User } from '@happykit/common/decorator/user.decorator';
import { BizLog } from '@happykit/common/decorator/log.decorator';
import { Public } from '@happykit/common/decorator/public.decorator';
import { ApiTags } from '@nestjs/swagger';

@Controller('user')
@ApiTags('用户')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly redisService: RedisService,
  ) {}

  @Post('login')
  @BizLog({ name: '授权模块', desc: '账号密码登录' })
  @Public()
  signIn(@Body() loginDto: LoginDto) {
    return R.success(this.userService.signIn(loginDto));
  }

  @Get('test')
  @BizLog({ name: '授权模块', desc: '测试方法' })
  // @Captcha()
  @Public()
  async test(@User() user: AuthUserInfo) {
    await this.userService.deleteById('clof43kcz0000pxu2qgcvmr79');
    // return R.success(
    //   await this.userService.findPage(
    //     {},
    //     {
    //       pageNo: 1,
    //       pageSize: 10,
    //     },
    //   ),
    // );
  }
}
