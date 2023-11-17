import { BaseVo } from '@happykit/common/base/base.vo';

export class SysDictVo extends BaseVo {
  id: string;
  /**
   * 字典名称
   */
  dictName: string;
  /**
   * 字典编码
   */
  dictCode: string;
  /**
   * 字典描述
   */
  dictDesc?: string;
}
