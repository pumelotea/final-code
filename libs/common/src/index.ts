export * from './common.module';
export * from './common.service';

export interface AuthUserInfo {
  id: string;
  nickname: string;
  name: string;
  avatar: string;
  more: any;
}
export declare interface ReqUser {
  user: AuthUserInfo;
}

export declare interface JWtOption {
  secret: string;
  expiresIn: string; // https://github.com/vercel/ms
}

export declare interface MySQLOption {
  datasourceUrl: string;
}

export declare interface RedisOption {
  port: number; // Redis port
  host: string; // Redis host
  password: string;
  db: number;
}
