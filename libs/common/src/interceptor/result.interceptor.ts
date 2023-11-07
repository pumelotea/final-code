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
  VO_PROPERTY_TRANSFORMER_META_KEY,
  VoMeta,
  VoPropertyTransformer,
  VoType,
} from '@happykit/common/decorator/vo.decorator';
import { METADATA_FACTORY_NAME as VOOOER } from '@codecoderun/voooer/dist/plugin-constants';

@Injectable()
export class ResultInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  /**
   * 获取vo的属性列表
   * @param voType
   * @private
   */
  private getPropertyKeys(voType: any): string[] {
    const keys: string[] = [];
    let proto = voType;
    let staticFn = Reflect.get(proto, VOOOER);
    while (staticFn) {
      const tKs = Object.keys(staticFn());
      keys.push(...tKs);
      proto = Reflect.getPrototypeOf(proto);
      staticFn = Reflect.get(proto, VOOOER);
    }
    return keys;
  }

  private getTransformers(
    target: any,
    propertyKey: string,
  ): VoPropertyTransformer[] {
    const transformerMeta: Record<string, VoPropertyTransformer[]> =
      Reflect.getMetadata(VO_PROPERTY_TRANSFORMER_META_KEY, target.prototype) || {};
    return [...(transformerMeta[propertyKey] || [])].reverse();
  }

  /**
   * 复制vo
   * @param voType
   * @param keys
   * @param from
   * @private
   */
  private copy2Vo(voType: any, keys: string[], from: any): any {
    const obj = Reflect.construct(voType, []) as any;
    keys.forEach((propertyKey) => {
      if (Reflect.has(from, propertyKey)) {
        let dataValue = Reflect.get(from, propertyKey);
        // @VoPropertyTransform装饰器的数据转换器实现
        const transformers = this.getTransformers(voType, propertyKey);
        transformers.forEach((fn) => {
          dataValue = fn.process(dataValue);
        });
        obj[propertyKey] = dataValue;
      }
    });
    return obj;
  }

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

        const keys = this.getPropertyKeys(meta.type);
        const from = args[0] || {};
        //常规对象
        if (!meta.voType || meta.voType === VoType.OBJECT) {
          const obj = this.copy2Vo(meta.type, keys, from);
          return R.success(obj);
        }

        // 列表
        if (meta.voType === VoType.LIST) {
          const list: any[] = [];
          from.forEach((t: any) => {
            const obj = this.copy2Vo(meta.type, keys, t);
            list.push(obj);
          });
          return R.success(list);
        }

        // 分页
        if (meta.voType === VoType.PAGE) {
          const list: any[] = [];
          from.list.forEach((t: any) => {
            const obj = this.copy2Vo(meta.type, keys, t);
            list.push(obj);
          });
          return R.success({
            list,
            total: from.total,
          });
        }
      }),
    );
  }
}
