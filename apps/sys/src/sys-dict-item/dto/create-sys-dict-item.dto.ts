import { IsOptional, IsNotEmpty } from 'class-validator';

export class CreateSysDictItemDto {
  @IsNotEmpty({ message: '不能为空' })
  dictId: string;
  /**
   * 字典项名称
   */
  @IsNotEmpty({ message: '字典项名称不能为空' })
  dictItemName: string;
  /**
   * 字典项值
   */
  @IsNotEmpty({ message: '字典项值不能为空' })
  dictItemValue: string;
  @IsOptional()
  orderNo?: number;
}
