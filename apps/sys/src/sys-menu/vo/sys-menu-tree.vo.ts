import { SysMenuVo } from './sys-menu.vo';

export class SysMenuTreeVo {
  node: SysMenuVo;
  /**
   * 子节点
   */
  children: SysMenuTreeVo[];
}
