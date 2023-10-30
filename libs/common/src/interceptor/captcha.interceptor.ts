import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { CaptchaService } from '@happykit/common/captcha/captcha.service';
import { ServiceException } from '@happykit/common/error';
import { Reflector } from '@nestjs/core';
import { CAPTCHA_META_KEY } from '@happykit/common/decorator/captcha.decorator';

@Injectable()
export class CaptchaInterceptor implements NestInterceptor {
  constructor(
    private readonly captchaService: CaptchaService,
    private readonly reflector: Reflector,
  ) {}
  async intercept(context: ExecutionContext, next: CallHandler) {
    // console.log('CaptchaInterceptor');

    const meta = this.reflector.get<boolean>(
      CAPTCHA_META_KEY,
      context.getHandler(),
    );

    if (meta !== true) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    const id = request.headers['captcha-id'];
    const text = request.headers['captcha-text'];
    const passed = await this.captchaService.verify(id, text);
    if (!passed) {
      throw new ServiceException('验证码校验未通过');
    }
    return next.handle();
  }
}
