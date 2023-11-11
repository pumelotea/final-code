import { Injectable } from '@nestjs/common';
import { BaseService } from '@happykit/common/base/base.service';
import { User } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { LoginDto } from '../../../app/src/user/dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ServiceException } from '@happykit/common/error';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {
    super();
  }

  protected get model() {
    return this.prisma.user;
  }

  async create(data: Partial<User>): Promise<User> {
    const saltRounds = 10;
    data.password = await new Promise<string>((resolve, reject) => {
      bcrypt.hash(data.password || '', saltRounds, function (err, hash) {
        // Store hash in your password DB.
        if (err) {
          reject(err);
          return;
        }
        resolve(hash);
      });
    });
    return super.create(data);
  }

  async signIn(loginDto: LoginDto) {
    const user = await this.findOne(
      {
        username: loginDto.username,
      },
      {},
    );
    
    if (!user) {
      throw new ServiceException('用户未找到');
    }

    const isOk = await new Promise((resolve, reject) => {
      bcrypt.compare(
        loginDto.password,
        user.password || '',
        function (err, result) {
          // result == true
          if (err) {
            reject(err);
            return;
          }
          resolve(result);
        },
      );
    });

    if (!isOk) {
      throw new ServiceException('账号密码验证失败');
    }
    const token = this.jwtService.sign({
      ...user,
    });
    //
    if (!token) {
      throw new ServiceException('颁发授权token失败');
    }
    return {
      token,
      ...user,
    };
  }

  signOut(userId: string) {}
}
