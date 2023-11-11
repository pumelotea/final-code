import { Logger, MiddlewareConsumer, Module } from '@nestjs/common';
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
import { SysRoleModule } from './sys-role/sys-role.module';
import { SysMenuModule } from './sys-menu/sys-menu.module';
import { ResultInterceptor } from '@happykit/common/interceptor/result.interceptor';
import { SysConfigModule } from './sys-config/sys-config.module';
import { RequestContextMiddleware } from '@happykit/common/context/request-context';

@Module({
  imports: [
    configModule,
    fileModule,
    prismaModule,
    jwtModule,
    redisModule,
    UserModule,
    CaptchaModule,
    SysRoleModule,
    SysConfigModule,
    SysMenuModule,
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
export class SysModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestContextMiddleware).forRoutes('*');
  }
}
