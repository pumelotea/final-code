import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
dayjs.extend(utc)
export const DTO_PROPERTY_TRANSFORMER_META_KEY = Symbol(
  'DTO_PROPERTY_TRANSFORMER_META_KEY',
);

export interface DtoPropertyTransformer {
  process(value: any): any;
}

export const DtoPropertyTransform = (fn: DtoPropertyTransformer) => {
  return (target: any, propertyName: string) => {
    // propertyName:[]
    let transformerMeta: Record<string, DtoPropertyTransformer[]> =
      Reflect.getMetadata(DTO_PROPERTY_TRANSFORMER_META_KEY, target);
    if (!transformerMeta) {
      transformerMeta = {};
      Reflect.defineMetadata(
        DTO_PROPERTY_TRANSFORMER_META_KEY,
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

export const DtoUtcDate = (format?: string) => {
  if (!format) {
    format = 'YYYY-MM-DD HH:mm:ss';
  }
  return DtoPropertyTransform({
    process: (value: string) => {
      if (!value) {
        return value;
      }
      const r = dayjs(value).utc().format(format);
      if ('Invalid Date' === r){
        return value;
      }
      return r;
    },
  });
};
