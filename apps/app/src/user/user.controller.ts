import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { LoginDto } from './dto/login.dto';
import { R } from '@happykit/common/result';
import { AuthUserInfo } from '@happykit/common';
import { RedisService } from '@songkeys/nestjs-redis';
import { User } from '@happykit/common/decorator/user.decorator';
import { BizLog } from '@happykit/common/decorator/log.decorator';
import { Captcha } from '@happykit/common/decorator/captcha.decorator';
import { Public } from '@happykit/common/decorator/public.decorator';

@Controller('user')
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
    await this.userService.create({
      name: 'zf',
      username: 'zzzz',
      password: '2222',
    });
    // await this.redisService.getClient().set('aaa', '123', 'EX', 10);

    // console.log(await this.redisService.getClient().get('aaa'));
    return R.success(await this.userService.findPage(1, 2));
  }
}
