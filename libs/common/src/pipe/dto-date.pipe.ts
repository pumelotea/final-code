import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import {
  DTO_PROPERTY_TRANSFORMER_META_KEY,
  DtoPropertyTransformer,
} from '@happykit/common/decorator/dto.decorator';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
dayjs.extend(utc)
export class DateUtcPipe implements PipeTransform{
  format: string;
  constructor(format :string = 'YYYY-MM-DD HH:mm:ss') {
    if (format){
      this.format = format;
    }
  }
  transform(value: any, metadata: ArgumentMetadata): any {
    if (metadata.type !== 'query' && metadata.type !== 'param' ){
      return value;
    }
    if (typeof value === 'object') {
      return value
    }
    if (typeof value === 'number'){
      return value
    }
    if (!value) {
      return value;
    }
    const r = dayjs(value).utc().format(this.format);
    if ('Invalid Date' === r){
      return value;
    }
    return r;
  }
}

export class DtoPropertyTransformPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata): any {
    if (metadata.type !== 'body'){
      return value;
    }
    if (typeof value !== 'object') {
      return value
    }
    // 对象的情况
    Object.keys(value).forEach((propertyKey) => {
      const transformers = this.getTransformers(metadata.metatype, propertyKey);
      let pv = Reflect.get(value, propertyKey);
      transformers.forEach((fn) => {
        pv = fn.process(pv);
      });
      Reflect.set(value, propertyKey, pv);
    });
    return value;
  }

  private getTransformers(
    target: any,
    propertyKey: string,
  ): DtoPropertyTransformer[] {
    const transformerMeta: Record<string, DtoPropertyTransformer[]> =
      Reflect.getMetadata(
        DTO_PROPERTY_TRANSFORMER_META_KEY,
        target.prototype,
      ) || {};
    return [...(transformerMeta[propertyKey] || [])].reverse();
  }
}
