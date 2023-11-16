import { IsNotEmpty } from 'class-validator';

export class BindRoleDto {
  @IsNotEmpty({ message: '菜单Id不能为空', each: true })
  roleIds: string[];
}
