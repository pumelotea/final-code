import { applyDecorators, SetMetadata } from '@nestjs/common';
import { Result } from '@happykit/common/result';
import { Type, HttpStatus } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';

const baseTypeNames = ['String', 'Number', 'Boolean'];

export const VO_META_KEY = Symbol('VO_META_KEY');
export const SKIP_TRANS_META_KEY = Symbol('SKIP_TRANS_META_KEY');
export const VO_PROPERTY_META_KEY = Symbol('VO_PROPERTY_META_KEY');

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
  const isPage = meta.voType === VoType.PAGE;
  const isList = meta.voType === VoType.LIST;
  const type = !isPage && !isList ? meta.type : [meta.type];

  return applyDecorators(
    SetMetadata<symbol, any>(VO_META_KEY, meta),
    ApiResult({ type, isPage }),
  );
};

/**
 * @description: 生成返回结果装饰器
 */
export const ApiResult = <TModel extends Type<any>>({
  type,
  isPage,
  status,
}: {
  type?: TModel | TModel[];
  isPage?: boolean;
  status?: HttpStatus;
}) => {
  let prop = null;

  if (Array.isArray(type)) {
    if (isPage) {
      prop = {
        type: 'object',
        properties: {
          list: {
            type: 'array',
            items: { $ref: getSchemaPath(type[0]) },
          },
          total: { type: 'number', default: 0 },
        },
      };
    } else {
      prop = {
        type: 'array',
        items: { $ref: getSchemaPath(type[0]) },
      };
    }
  } else if (type) {
    if (type && baseTypeNames.includes(type.name)) {
      prop = { type: type.name.toLocaleLowerCase() };
    } else {
      prop = { $ref: getSchemaPath(type) };
    }
  } else {
    prop = { type: 'null', default: null };
  }

  const model = Array.isArray(type) ? type[0] : type;
  return applyDecorators(
    ApiExtraModels(model!),
    ApiResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(Result) },
          {
            properties: {
              code: { type: 'number', default: 0 },
              success: { type: 'boolean', default: true },
              message: { type: 'string', default: 'success' },
              timestamp: { type: 'number', default: Date.now() },
              payload: prop,
            },
          },
        ],
      },
      status,
    }),
  );
};
