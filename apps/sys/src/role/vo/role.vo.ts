import { BaseVo } from '@happykit/common/base/base.vo';
import { VoPropertyTransform } from '@happykit/common/decorator/vo.decorator';

export class RoleVo extends BaseVo {
  @VoPropertyTransform({ process: (v: any) => `aaaaaa` })
  id: string;
  /**
   * 角色名称
   */
  roleName: string;
  /**
   * 角色描述
   */
  roleDesc: string;
}
