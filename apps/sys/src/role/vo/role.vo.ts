import { BaseVo } from '@happykit/common/base/base.vo';

export class RoleVo extends BaseVo {
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
