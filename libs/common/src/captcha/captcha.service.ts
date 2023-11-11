import { Injectable } from '@nestjs/common';
import * as SvgCaptcha from 'svg-captcha';
import { nanoid } from 'nanoid';
import { CaptchaGenerateResult } from '@happykit/common/captcha/captcha.module-definition';
import { RedisService } from '@songkeys/nestjs-redis';

@Injectable()
export class CaptchaService {
  constructor(private readonly redisService: RedisService) {}
  async getMathExpr(): Promise<CaptchaGenerateResult> {
    const id = nanoid(16);

    const res = SvgCaptcha.createMathExpr({
      mathMax: 100,
      mathMin: -100,
    });
    //写入redis存储
    await this.redisService
      .getClient()
      .set(`/Captcha/${id}`, res.text, 'EX', 5 * 60);

    res.data = res.data.replaceAll('"', "'");
    return {
      id,
      ...res,
    };
  }

  async getCommon(): Promise<CaptchaGenerateResult> {
    const id = nanoid(16);
    const res = SvgCaptcha.create();
    //写入redis存储
    await this.redisService
      .getClient()
      .set(`/Captcha/${id}`, res.text, 'EX', 5 * 60);
    //写入redis存储
    res.data = res.data.replaceAll('"', "'");
    return {
      id,
      ...res,
    };
  }

  async verify(id: string, text: string): Promise<boolean> {
    if (!text) {
      return false;
    }
    const res = await this.redisService.getClient().get(`/Captcha/${id}`);
    if (!res) {
      return false;
    }

    await this.redisService.getClient().del(`/Captcha/${id}`);
    return res === text;
  }
}
