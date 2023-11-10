import { IsOptional, IsNotEmpty } from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty({ message: '不能为空' })
  id: string;

  @IsOptional()
  roleName?: string;

  @IsOptional()
  roleDesc?: string;
}
