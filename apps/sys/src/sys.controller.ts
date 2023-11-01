import { Controller, Get } from '@nestjs/common';
import { Public } from '@happykit/common/decorator/public.decorator';
import { R } from '@happykit/common/result';
import { ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('健康')
export class SysController {
  /**
   * APP服务健康检查
   */
  @Get()
  @Public()
  index() {
    return R.success(`Sys Application Run Mode [${process.env.mode}]`);
  }
}
