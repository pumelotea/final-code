import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { AuthException } from '@happykit/common/error';
import { Request as Req } from 'express';
import { ReqUser } from '@happykit/common';
import { Reflector } from '@nestjs/core';
import { PUBLIC_META_KEY } from '@happykit/common/decorator/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private jwtService: JwtService,
  ) {}
  private async validateRequest(request: Req & ReqUser): Promise<boolean> {
    if (!request.headers['authorization']) {
      throw new AuthException(`失败(missing jwt token)`);
    }

    const parts = request.headers['authorization'].trim().split(' ');
    // 从 header 上获取校验信息

    if (parts.length !== 2) {
      throw new AuthException('失败(error jwt token)');
    }

    const [scheme, token] = parts;

    if (/^Bearer$/i.test(scheme)) {
      try {
        //jwt.verify方法验证token是否有效
        this.jwtService.verify(token, {
          complete: true,
        });
        // 用户鉴权信息，注入上下文
        const d: any = this.jwtService.decode(token);
        request.user = {
          id: d.id || '',
          avatar: '',
          more: null,
          name: '',
          nickname: '',
        };
      } catch (error) {
        throw new AuthException(`失败(${error.message})`);
      }
      return true;
    } else {
      throw new AuthException('失败(error jwt scheme)');
    }
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const meta = this.reflector.get<boolean>(
      PUBLIC_META_KEY,
      context.getHandler(),
    );
    if (meta === true) {
      return true;
    }

    return this.validateRequest(request);
  }
}
