export class BaseDto {
  /**
   * 创建时间
   */
  createdAt?: Date;
  /**
   * 创建者
   */
  createdBy?: string;
  /**
   * 更新时间
   */
  updatedAt?: Date;
  /**
   * 更新者
   */
  updatedBy?: string;
  /**
   * 删除时间
   */
  deleted?: Date;
  /**
   * 删除者
   */
  deletedBy?: string;
}
