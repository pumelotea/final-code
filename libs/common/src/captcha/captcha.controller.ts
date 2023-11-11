import { Controller, Get } from '@nestjs/common';
import { CaptchaService } from '@happykit/common/captcha/captcha.service';
import { BizLog } from '@happykit/common/decorator/log.decorator';
import { Public } from '@happykit/common/decorator/public.decorator';
import { ApiTags } from '@codecoderun/swagger';
import { AutoVo } from '@happykit/common/decorator/vo.decorator';
import { CaptchaVo } from '@happykit/common/captcha/captcha.vo';

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
  @AutoVo({ type: CaptchaVo })
  async getCaptcha() {
    return await this.captchaService.getCommon();
  }

  /**
   * 数学公式图形验证码
   */
  @Get('/math_expr')
  @BizLog({ name: '验证码', desc: '数学公式图形验证码' })
  @Public()
  @AutoVo({ type: CaptchaVo })
  async getMathExpr() {
    return await this.captchaService.getMathExpr();
  }
}
