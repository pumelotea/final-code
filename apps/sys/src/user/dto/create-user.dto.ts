import { IsOptional } from 'class-validator';

export class CreateUserDto {
  /**
   * 用户名
   */
  @IsOptional()
  username?: string;
  /**
   * 密码
   */
  @IsOptional()
  password?: string;
  @IsOptional()
  salt?: string;
  /**
   * 姓名
   */
  @IsOptional()
  name?: string;
  /**
   * 昵称
   */
  @IsOptional()
  nickname?: string;
  /**
   * 头像
   */
  @IsOptional()
  avatar?: string;
  /**
   * 是否启用
   */
  @IsOptional()
  isEnable: boolean;
  /**
   * 电话号码
   */
  @IsOptional()
  phoneNumber?: string;
}
