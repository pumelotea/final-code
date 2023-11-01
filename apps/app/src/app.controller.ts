import { Controller, Get } from '@nestjs/common';
import { R } from '@happykit/common/result';
import { Public } from '@happykit/common/decorator/public.decorator';
import { ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('健康')
export class AppController {
  /**
   * APP服务健康检查
   */
  @Get()
  @Public()
  index() {
    return R.success('Application Online');
  }
}
