import { Controller, Get } from '@nestjs/common';
import { Public } from '@happykit/common/decorator/public.decorator';
import { ApiTags } from '@codecoderun/swagger';
import { SkipTransform } from '@happykit/common/decorator/vo.decorator';

@Controller()
@ApiTags('健康')
export class SysController {
  /**
   * 服务健康检查
   */
  @Get()
  @Public()
  index(): string {
    return `Sys Application Run Mode [${process.env.mode}]`;
  }

  /**
   * 服务内存信息
   */
  @Get('/health')
  @Public()
  health() {
    return process.memoryUsage();
  }
}
