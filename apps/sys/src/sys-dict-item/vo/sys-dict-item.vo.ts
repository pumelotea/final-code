import { BaseVo } from '@happykit/common/base/base.vo';

export class SysDictItemVo extends BaseVo {
  id: string;
  dictId: string;
  /**
   * 字典项名称
   */
  dictItemName: string;
  /**
   * 字典项值
   */
  dictItemValue: string;
  orderNo?: number;
}
