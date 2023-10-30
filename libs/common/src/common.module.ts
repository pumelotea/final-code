import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { FileModule } from './file/file.module';
import { CaptchaService } from './captcha/captcha.service';
import { CaptchaController } from './captcha/captcha.controller';
import { CaptchaModule } from './captcha/captcha.module';

@Module({
  providers: [CommonService, CaptchaService],
  exports: [CommonService],
  imports: [FileModule, CaptchaModule],
  controllers: [CaptchaController],
})
export class CommonModule {}
