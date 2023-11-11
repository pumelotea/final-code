import { BaseVo } from '@happykit/common/base/base.vo';

export class UserVo extends BaseVo {
  id: string;
  /**
   * 用户名
   */
  username?: string;
  /**
   * 姓名
   */
  name?: string;
  /**
   * 昵称
   */
  nickname?: string;
  /**
   * 头像
   */
  avatar?: string;
  /**
   * 是否启用
   */
  isEnable?: boolean;
  /**
   * 电话号码
   */
  phoneNumber?: string;
}
