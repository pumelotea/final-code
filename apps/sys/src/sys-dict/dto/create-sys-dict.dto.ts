import { IsOptional, IsNotEmpty } from 'class-validator';

export class CreateSysDictDto {
  /**
   * 字典名称
   */
  @IsNotEmpty({ message: '字典名称不能为空' })
  dictName: string;
  /**
   * 字典编码
   */
  @IsNotEmpty({ message: '字典编码不能为空' })
  dictCode: string;
  /**
   * 字典描述
   */
  @IsOptional()
  dictDesc?: string;
}
