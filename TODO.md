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
- [x] 应用入口多个：app、sys
- [x] 操作数据不要影响行数为0，但是不要报错 

### 进阶

- [x] RBAC
  - 菜单
  - 角色、菜单角色关系
  - 用户、用户角色关系
  - 字典、字典值
- [x] 登录

### 生成器
- [x] 通过生成器生成正删改查代码 `nest g res xxx`
需要生成service、 dto、 vo、 controller

## 部署
- [ ] Docker
- [ ] pm2

