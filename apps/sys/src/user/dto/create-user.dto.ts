import { IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class CreateUserDto {
  /**
   * 用户名
   */
  @IsOptional()
  @IsNotEmpty({ message: '用户名不能为空' })
  username?: string;
  /**
   * 密码
   */
  @IsOptional()
  @IsNotEmpty({ message: '密码不能为空' })
  @MinLength(6, { message: '密码最小长度为$constraint1' })
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
