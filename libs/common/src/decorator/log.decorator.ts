import { SetMetadata } from '@nestjs/common';

export interface BizMeta {
  name: string;
  desc?: string;
}
export const BIZ_LOG_KEY = Symbol('BIZ_LOG_KEY');

export const BizLog = (meta: BizMeta) =>
  SetMetadata<symbol, BizMeta>(BIZ_LOG_KEY, meta);
