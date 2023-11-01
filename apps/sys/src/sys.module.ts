import { Logger, Module } from '@nestjs/common';
import { SysController } from './sys.controller';
import { SysService } from './sys.service';
import { configModule, fileModule, jwtModule, prismaModule, redisModule } from './config/configuration';
import { UserModule } from '../../app/src/user/user.module';
import { CaptchaModule } from '@happykit/common/captcha/captcha.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthGuard } from '@happykit/common/auth/auth.guard';
import { LoggerInterceptor } from '@happykit/common/interceptor/logger.interceptor';
import { CaptchaInterceptor } from '@happykit/common/interceptor/captcha.interceptor';

@Module({
  imports: [
    configModule,
    fileModule,
    prismaModule,
    jwtModule,
    redisModule,
    UserModule,
    CaptchaModule,
  ],
  controllers: [SysController],
  providers: [
    SysService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CaptchaInterceptor,
    },
    Logger,
  ],
})
export class SysModule {}
