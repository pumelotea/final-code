import { BaseVo } from '@happykit/common/base/base.vo';

export class SysMenuVo extends BaseVo {
  id: string;
  parentId: string;
  /**
   * 名称
   */
  name: string;
  /**
   * 类型，菜单还是按钮
   */
  type: string;
  /**
   * 图标名称
   */
  icon: string;
  /**
   * 请求路径
   */
  path: string;
  /**
   * 视图容器
   */
  view: string;
  /**
   * 是否缓存
   */
  isKeepalive: string;
  /**
   * 是否路由
   */
  isRouter: string;
  /**
   * 是否隐藏路由
   */
  isHide: string;
  /**
   * 是否外链
   */
  isExternalLink: string;
  /**
   * 是否首页
   */
  isHome: string;
  /**
   * 外链地址
   */
  externalLinkAddress: string;
  /**
   * 按钮标识
   */
  permissionKey: string;
  /**
   * 浏览器标签 _self _blank
   */
  linkTarget: string;
  /**
   * 0=禁用 1=启用
   */
  isEnable: boolean;
  /**
   * 排序
   */
  orderNo: number;
}
