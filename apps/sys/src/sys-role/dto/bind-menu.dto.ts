import { IsNotEmpty } from 'class-validator';

export class BindMenuDto {
  @IsNotEmpty({ message: '菜单Id不能为空', each: true })
  menuIds: string[];
}
