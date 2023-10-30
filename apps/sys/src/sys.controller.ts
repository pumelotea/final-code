import { Controller, Get } from '@nestjs/common';
import { SysService } from './sys.service';

@Controller()
export class SysController {
  constructor(private readonly sysService: SysService) {}

  @Get()
  getHello(): string {
    return this.sysService.getHello();
  }
}
