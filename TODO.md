# final-code

### 基础

- [x] 多环境
- [x] 封装统一返回
- [x] 封装全局异常处理
- [x] 跨域处理
- [x] 参数校验
  - https://github.com/typestack/class-validator
- [x] 封装JWT过滤器
- [x] 统一文件上传 本地、对接minio，管道校验，条件注入
- [x] 统一日志
- [x] 最好通过注解实现:业务日志入库待实现
  - 分error、all
- [x] API文档 swagger
- [x] 整合Redis 
  - https://www.npmjs.com/package/@songkeys/nestjs-redis 
  - https://github.com/songkeys/nestjs-redis/blob/HEAD/docs/latest/redis.md
- [x] 验证码，支持配置的path拦截，然后进行校验；优化方向全局注入，局部拦截
- [x] 优化配置获取方式:最好通过注入方式
- [x] 整合Prisma ORM 
  - https://www.npmjs.com/package/nestjs-prisma
  - https://prisma.yoga/concepts/components/prisma-client/crud
    - 标准字段
    - 基础服务类、基础控制器
    - 分页

### 进阶

- [ ] 菜单、权限、用户、角色
- [ ] 登录
- [X] 应用入口多个：app、sys
- [ ] 数据库标准字段

### 生成器
- [ ] 通过生成器生成正删改查代码 `nest g res xxx`
需要生成service、 dto、 vo、 controller


## 部署
- [ ] Docker
- [ ] pm2


### 自动化vo包装器 (@AutoVO()、@AutoVoProperty())
1. 返回给前端：自动包装标准传输格式，自动转换指定vo对象（类似BeanCopy）,支持跳过处理（@SkipTransform()）
2. VO自动包装器指定后，同步swagger输出文档
3. 如果不指定VO包装器，需要手动包装vo，以及swagger 返回格式 通过@ApiResult()注解

自动化vo包装器：通过在控制器上方法添加@AutoVo()，然后vo类上添加vo注解，最终这些属性最终用于拷贝原始返回值,分页需要标识;
同步实现swagger返回类型标识，问题是加入输出的属性不能和swagger同步，

vo拷贝和swagger不同步
