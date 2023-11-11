import { UserVo } from './user.vo';

export class LoginVo extends UserVo {
  /**
   * 登录token
   */
  token: string;
}
