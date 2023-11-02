import { Logger, Module } from '@nestjs/common';
import { SysController } from './sys.controller';
import { SysService } from './sys.service';
import {
  configModule,
  fileModule,
  jwtModule,
  prismaModule,
  redisModule,
} from './config/configuration';
import { CaptchaModule } from '@happykit/common/captcha/captcha.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthGuard } from '@happykit/common/auth/auth.guard';
import { LoggerInterceptor } from '@happykit/common/interceptor/logger.interceptor';
import { CaptchaInterceptor } from '@happykit/common/interceptor/captcha.interceptor';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
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
    RoleModule,
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
    {
      provide: APP_INTERCEPTOR,
      useClass: ResultInterceptor,
    },
    Logger,
  ],
})
export class SysModule {}
