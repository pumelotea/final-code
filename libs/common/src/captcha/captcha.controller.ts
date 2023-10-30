import { Controller, Get } from '@nestjs/common';
import { CaptchaService } from '@happykit/common/captcha/captcha.service';
import { R } from '@happykit/common/result';
import { BizLog } from '@happykit/common/decorator/log.decorator';
import { Public } from '@happykit/common/decorator/public.decorator';

@Controller('captcha')
export class CaptchaController {
  constructor(private captchaService: CaptchaService) {}

  @Get('/common')
  @BizLog({ name: '验证码', desc: '字母图形验证码' })
  @Public()
  async getCaptcha() {
    return R.success(await this.captchaService.getCommon());
  }

  @Get('/math_expr')
  @BizLog({ name: '验证码', desc: '数学公式图形验证码' })
  @Public()
  async getMathExpr() {
    return R.success(await this.captchaService.getMathExpr());
  }
}
