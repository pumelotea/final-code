import { BaseVo } from '@happykit/common/base/base.vo';

export class SysConfigVo extends BaseVo {
  id: string;
  /**
   * 键
   */
  key: string;

  /**
   * 值
   */
  value: string;

  /**
   * 类型
   */
  type: string;

  /**
   * 备注
   */
  remark: string;
}
