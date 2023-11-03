import { IsNotEmpty, MaxLength, IsOptional } from 'class-validator';

export class CreateRoleDto {
  /**
   * 角色名称
   */
  @IsNotEmpty({ message: '角色名称不能为空' })
  roleName?: string;
  /**
   * 角色描述
   */
  @MaxLength(10, { message: '角色描述长度最大为100' })
  @IsOptional()
  roleDesc?: string;
}
