import { applyDecorators, SetMetadata } from '@nestjs/common';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

export const VO_META_KEY = Symbol('VO_META_KEY');
export const VO_KEY = Symbol('VO_KEY');
export const SKIP_TRANS_META_KEY = Symbol('SKIP_TRANS_META_KEY');
export const VO_PROPERTY_TRANSFORMER_META_KEY = Symbol(
  'VO_PROPERTY_TRANSFORMER_META_KEY',
);

export enum VoType {
  PAGE = 'PAGE',
  LIST = 'LIST',
  OBJECT = 'OBJECT',
}

export const SkipTransform = () => {
  return SetMetadata<symbol, boolean>(SKIP_TRANS_META_KEY, true);
};
export interface VoMeta {
  type: any;
  voType?: VoType;
}

export const AutoVo = (meta: VoMeta) => {
  // const isPage = meta.voType === VoType.PAGE;
  // const isList = meta.voType === VoType.LIST;
  // const type = !isPage && !isList ? meta.type : [meta.type];

  return applyDecorators(SetMetadata<symbol, any>(VO_META_KEY, meta));
};

export const Vo = (meta: VoMeta) => {
  return SetMetadata<symbol, any>(VO_KEY, meta);
};

export interface VoPropertyTransformer {
  process(value: any): any;
}

export const VoPropertyTransform = (fn: VoPropertyTransformer) => {
  return (target: any, propertyName: string) => {
    // propertyName:[]
    let transformerMeta: Record<string, VoPropertyTransformer[]> =
      Reflect.getMetadata(VO_PROPERTY_TRANSFORMER_META_KEY, target);
    if (!transformerMeta) {
      transformerMeta = {};
      Reflect.defineMetadata(
        VO_PROPERTY_TRANSFORMER_META_KEY,
        transformerMeta,
        target,
      );
    }
    let transformerFns = transformerMeta[propertyName];
    if (!transformerFns) {
      transformerFns = [];
      transformerMeta[propertyName] = transformerFns;
    }
    transformerFns.push(fn);
  };
};

export const VoDate = (format?: string) => {
  if (!format) {
    format = 'YYYY-MM-DD HH:mm:ss';
  }
  return VoPropertyTransform({
    process: (value: string) => {
      if (!value) {
        return value;
      }
      return dayjs(value).utc().format(format);
    },
  });
};
