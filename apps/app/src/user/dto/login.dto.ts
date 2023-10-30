import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: '用户名不能为空 ' })
  @MinLength(10, { message: '用户名长度需要大于$constraint1' })
  @MaxLength(20, { message: '用户名长度需要小于$constraint1' })
  username: string;
  @IsNotEmpty({ message: '密码不能为空' })
  password: string;
}
