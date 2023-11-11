import { IsOptional, IsNotEmpty } from 'class-validator';

export class CreateSysMenuDto {
  @IsNotEmpty({ message: '不能为空' })
  parentId: string;
  /**
   * 名称
   */
  @IsNotEmpty({ message: '名称不能为空' })
  name: string;
  /**
   * 类型，菜单还是按钮
   */
  @IsOptional()
  type?: string;
  /**
   * 图标名称
   */
  @IsOptional()
  icon?: string;
  /**
   * 请求路径
   */
  @IsOptional()
  path?: string;
  /**
   * 视图容器
   */
  @IsOptional()
  view?: string;
  /**
   * 是否缓存
   */
  @IsOptional()
  isKeepalive?: string;
  /**
   * 是否路由
   */
  @IsOptional()
  isRouter?: string;
  /**
   * 是否隐藏路由
   */
  @IsOptional()
  isHide?: string;
  /**
   * 是否外链
   */
  @IsOptional()
  isExternalLink?: string;
  /**
   * 是否首页
   */
  @IsOptional()
  isHome?: string;
  /**
   * 外链地址
   */
  @IsOptional()
  externalLinkAddress?: string;
  /**
   * 按钮标识
   */
  @IsOptional()
  permissionKey?: string;
  /**
   * 浏览器标签 _self _blank
   */
  @IsOptional()
  linkTarget?: string;
  /**
   * 0=禁用 1=启用
   */
  @IsNotEmpty({ message: '0=禁用 1=启用不能为空' })
  isEnable: boolean;
  /**
   * 排序
   */
  @IsOptional()
  orderNo?: number;
}
