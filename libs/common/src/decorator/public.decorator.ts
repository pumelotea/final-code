import { SetMetadata } from '@nestjs/common';

export const PUBLIC_META_KEY = Symbol('PUBLIC_META_KEY');

export const Public = () => SetMetadata<symbol, boolean>(PUBLIC_META_KEY, true);
