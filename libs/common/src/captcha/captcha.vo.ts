import { VoPropertyTransform } from '@happykit/common/decorator/vo.decorator';

export class CaptchaVo {
  data: string;
  @VoPropertyTransform({ process: () => '' })
  text: string;
  id: string;
}
