# Final Code

> 这是一个多服务api开发框架，based on nestjs.

## 架构

基于`monorepo`大仓库模式实现，能满足日常多服务系统架构的研发和实现。
比如app服务、后台服务、中台服务。

## 多环境运行

**原理**

根据运行时的node环境变量进行启动时切换。下面是3个常规的环境配置文件。

- [config.dev.ts](apps%2Fapp%2Fsrc%2Fconfig%2Fconfig.dev.ts)
- [config.local.ts](apps%2Fapp%2Fsrc%2Fconfig%2Fconfig.local.ts)
- [config.prod.ts](apps%2Fapp%2Fsrc%2Fconfig%2Fconfig.prod.ts)

切换实现
[configuration.ts](apps%2Fapp%2Fsrc%2Fconfig%2Fconfiguration.ts)

```typescript
/**
 * 多环境配置
 */
let runtimesConfig = ConfigLocal;
switch (process.env.mode) {
  case 'local':
    runtimesConfig = ConfigLocal;
    break;
  case 'dev':
    runtimesConfig = ConfigDev;
    break;
  case 'prod':
    runtimesConfig = ConfigProd;
}
const options = () => {
  return runtimesConfig;
};
```

## 响应统一JSON

```typescript
export class Result<T> {
  constructor(code: number, success: boolean, message: string, payload: T) {
    this.code = code;
    this.success = success;
    this.message = message;
    this.payload = payload;
    this.timestamp = Date.now();
  }

  timestamp: number;

  code: number;

  success: boolean;

  message: string;

  payload: T | null;
}
```

涉及到的全局抛出的异常处理、数据库异常错误、Dto校验错误，均覆写统一为`Result`结构输出给前端。
使用上只要导入`R`对象即可，调用R上面的静态方法。

## 全局异常处理

全局异常处理可以简化业务代码的组织和编写。涉及到的全局异常

1. 控制器中的方法抛出的不可预知的错误 （错误信息只取err.message返回前端）
2. 数据库操作产生的异常 （数据库错误提示信息过于专业，因此会简化为简单的信息）
3. 路由404
4. 请求参数校验错误（如果有多个校验错误，默认只会返回第一个错误）
5. 鉴权错误
6. 验证码校验错误

以上相关逻辑产生的错误均会通过`R.failure()`返回json给前端。

## 跨域处理

跨域是个安全问题，默认由引导程序创建方法静态写死。默认是开启状态。
如果需要调整，请修改文件：[configuration.ts](libs%2Fcommon%2Fsrc%2Fconfig%2Fconfiguration.ts)

```js
//跨域
application.enableCors();
```

## 参数校验

参数校验基于`class-validator`库，使用上没有特别的不同。常规的话只要在dto的属性上添加约束注解即可。
详细移步官方文档：https://github.com/typestack/class-validator

例子：

```typescript
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  /**
   * 用户名
   */
  @IsNotEmpty({ message: '用户名不能为空' })
  @MinLength(10, { message: '用户名长度需要大于$constraint1' })
  @MaxLength(20, { message: '用户名长度需要小于$constraint1' })
  username: string;

  /**
   * 密码
   */
  @IsNotEmpty({ message: '密码不能为空' })
  password: string;
}
```

## JWT鉴权模块

基于守卫实现的Jwt鉴权拦截，在需要使用的service种注入即可。

```typescript
private readonly
jwtService: JwtService
```

如果接口需要公开，不走校验通道，在请求方法上加上`@Public()`注解即可。该注解从`@happykit/commom`导入

获取当前用户的信息，只需要通过`@User`注解进行获取即可。

```typescript
@Get('test')
@BizLog({ name: '授权模块', desc: '测试方法' })
async
test(@User()
user: AuthUserInfo
)
{

}
```

## 日志

1. 文件日志默认会根据服务名称和时间进行切分和14天滚动存储，默认分为error、combined 两类日志进行分类。
2. 控制台日志默认是输出是带有色彩的。
3. 业务模块日志，可以通过`@BizLog({ name: '授权模块', desc: '测试方法' })`注解进行修饰请求方法，被标注后的方法产生的日志会同步插入到数据库日志表中。

## 接口文档

采用swagger实现，但是根据nestjs官方插件，可以简化注解的使用，常规可以编写DTO、控制器、方法注释即可生成；同时参数校验器的属性也会被收集到文档中。
每个服务均有自己的swagger地址。

## Redis

默认整合Redis，注入相关服务即可使用。

## 图形验证码

基于`svg-captcha`
库实现，默认会提供2个endpoint供生成验证码svg。如果接口需要验证码校验，那么在该接口的请求方法上添加注解`@Captcha()`即可。
前端调用该接口时会自动被要求传入验证码id、验证码文本。

前端传递验证码参数需要通过header传递，因为验证码校验服务是从header中提取id和文本的。
```typescript
const id = request.headers['captcha-id'];
const text = request.headers['captcha-text'];
```

## 数据库ORM
数据库orm框架有助于简化数据库操作。这里集成了Prisma.
默认实现了一个基础的服务，常规服务可以继承该服务，便可快速实现CRUD。
详细文档：https://www.prisma.io/

