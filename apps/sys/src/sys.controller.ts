import { Controller, Get } from '@nestjs/common';
import { Public } from '@happykit/common/decorator/public.decorator';
import { ApiTags } from '@codecoderun/swagger';

@Controller()
@ApiTags('健康')
export class SysController {
  /**
   * APP服务健康检查
   */
  @Get()
  @Public()
  index(): string {
    return `Sys Application Run Mode [${process.env.mode}]`;
  }

  @Get('/health')
  @Public()
  health() {
    return process.memoryUsage();
  }
}
