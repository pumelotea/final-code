import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthGuard } from '@happykit/common/auth/auth.guard';
import {
  configModule,
  fileModule,
  jwtModule,
  prismaModule,
  redisModule,
} from './config/configuration';
import { CaptchaModule } from '@happykit/common/captcha/captcha.module';
import { LoggerInterceptor } from '@happykit/common/interceptor/logger.interceptor';
import { CaptchaInterceptor } from '@happykit/common/interceptor/captcha.interceptor';
import { ResultInterceptor } from '@happykit/common/interceptor/result.interceptor';

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
  controllers: [AppController],
  providers: [
    AppService,
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
    {
      provide: APP_INTERCEPTOR,
      useClass: ResultInterceptor,
    },
    Logger,
  ],
})
export class AppModule {}
