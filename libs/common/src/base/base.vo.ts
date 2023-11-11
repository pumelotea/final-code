import { VoDate } from '@happykit/common/decorator/vo.decorator';

export class BaseVo {
  /**
   * 创建时间
   */
  @VoDate()
  createdAt?: Date;
  /**
   * 创建者
   */
  createdBy?: string;
  /**
   * 更新时间
   */
  @VoDate()
  updatedAt?: Date;
  /**
   * 更新者
   */
  updatedBy?: string;
  /**
   * 删除时间
   */
  @VoDate()
  deleted?: Date;
  /**
   * 删除者
   */
  deletedBy?: string;
}
