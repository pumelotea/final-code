import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateSysConfigDto {
  /**
   * 键
   */
  @IsNotEmpty({ message: 'key不能为空' })
  key: string;

  /**
   * 值
   */
  @IsNotEmpty({ message: 'value不能为空' })
  value: string;

  /**
   * 类型
   */
  @IsOptional()
  type: string;

  /**
   * 备注
   */
  @IsOptional()
  remark: string;
}
