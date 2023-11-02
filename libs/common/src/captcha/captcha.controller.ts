import { Controller, Get } from '@nestjs/common';
import { CaptchaService } from '@happykit/common/captcha/captcha.service';
import { BizLog } from '@happykit/common/decorator/log.decorator';
import { Public } from '@happykit/common/decorator/public.decorator';
import { ApiTags } from '@nestjs/swagger';

@Controller('captcha')
@ApiTags('验证码')
export class CaptchaController {
  constructor(private captchaService: CaptchaService) {}

  /**
   * 字母图形验证码
   */
  @Get('/common')
  @BizLog({ name: '验证码', desc: '字母图形验证码' })
  @Public()
  async getCaptcha() {
    return await this.captchaService.getCommon();
  }

  /**
   * 数学公式图形验证码
   */
  @Get('/math_expr')
  @BizLog({ name: '验证码', desc: '数学公式图形验证码' })
  @Public()
  async getMathExpr() {
    return await this.captchaService.getMathExpr();
  }
}
