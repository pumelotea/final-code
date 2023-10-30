import { Injectable } from '@nestjs/common';

@Injectable()
export class SysService {
  getHello(): string {
    return 'Hello World! 3001';
  }
}
