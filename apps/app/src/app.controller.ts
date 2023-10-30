import { Controller, Get } from '@nestjs/common';
import { R } from '@happykit/common/result';
@Controller()
export class AppController {
  @Get()
  index() {
    return R.success('Application Online');
  }
}
