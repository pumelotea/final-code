import { Injectable, Logger } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ServiceException } from '@happykit/common/error';
import { PrismaService } from 'nestjs-prisma';
import { BaseService } from '@happykit/common/base/base.service';
import { User } from '@prisma/client';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {
    super();
  }

  signIn(loginDto: LoginDto) {
    Logger.log('Login=>' + JSON.stringify(loginDto));
    const data = {
      uid: 1,
      username: 'zhufeng',
    };
    const token = this.jwtService.sign({
      id: data.uid,
    });

    if (!token) {
      throw new ServiceException('颁发授权token失败');
    }
    return token;
  }

  protected get model() {
    return this.prisma.user;
  }
}
