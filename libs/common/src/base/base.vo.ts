import { VoDate } from '@happykit/common/decorator/vo.decorator';

export class BaseVo {
  /**
   * 创建时间
   */
  @VoDate()
  createdAt?: Date | null;
  /**
   * 创建者
   */
  createdBy?: string | null;
  /**
   * 更新时间
   */
  @VoDate()
  updatedAt?: Date | null;
  /**
   * 更新者
   */
  updatedBy?: string | null;
  /**
   * 删除时间
   */
  @VoDate()
  deleted?: Date | null;
  /**
   * 删除者
   */
  deletedBy?: string | null;
}
