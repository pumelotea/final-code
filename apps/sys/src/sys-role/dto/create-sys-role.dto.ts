import { IsOptional } from 'class-validator';

export class CreateSysRoleDto {
  /**
   * 角色名称
   */
  @IsOptional()
  roleName?: string;
  /**
   * 角色描述
   */
  @IsOptional()
  roleDesc?: string;
}
