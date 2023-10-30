import { SetMetadata } from '@nestjs/common';

export const CAPTCHA_META_KEY = Symbol('CAPTCHA_META_KEY');

export const Captcha = () => SetMetadata<symbol, boolean>(CAPTCHA_META_KEY, true);
