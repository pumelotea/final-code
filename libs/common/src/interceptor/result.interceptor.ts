import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs';
import { R } from '@happykit/common/result';
import { Reflector } from '@nestjs/core';
import {
  SKIP_TRANS_META_KEY,
  VO_META_KEY,
  VoMeta,
  VoType,
} from '@happykit/common/decorator/vo.decorator';

@Injectable()
export class ResultInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}
  async intercept(context: ExecutionContext, next: CallHandler) {
    const meta = this.reflector.get<VoMeta>(VO_META_KEY, context.getHandler());
    const skipTrans = this.reflector.get<boolean>(
      SKIP_TRANS_META_KEY,
      context.getHandler(),
    );
    if (skipTrans) {
      return next.handle();
    }

    return next.handle().pipe(
      map((...args) => {
        if (!meta) {
          return R.success(args[0]);
        }
        const keys: string[] = Reflect.getMetadata(
          'swagger/apiModelPropertiesArray',
          meta.type.prototype,
        ).map((e: string) => e.substring(1));

        //常规对象
        if (!meta.voType || meta.voType === VoType.OBJECT) {
          const target = args[0] || {};
          const obj = Reflect.construct(meta.type, []) as any;
          keys.forEach((k) => {
            if (Reflect.has(target, k)) {
              obj[k] = Reflect.get(target, k);
            }
          });
          return R.success(obj);
        }

        // 列表
        if (meta.voType === VoType.LIST) {
          const target = args[0] || [];
          const list: any[] = [];
          target.forEach((t: any) => {
            const obj = Reflect.construct(meta.type, []) as any;
            keys.forEach((k) => {
              if (Reflect.has(t, k)) {
                obj[k] = Reflect.get(t, k);
              }
            });
            list.push(obj);
          });
          return R.success(list);
        }

        // 分页
        if (meta.voType === VoType.PAGE) {
          const target = args[0] || {};
          const list: any[] = [];
          target.list.forEach((t: any) => {
            const obj = Reflect.construct(meta.type, []) as any;
            keys.forEach((k) => {
              if (Reflect.has(t, k)) {
                obj[k] = Reflect.get(t, k);
              }
            });
            list.push(obj);
          });
          return R.success({
            list,
            total: target.total,
          });
        }
      }),
    );
  }
}
