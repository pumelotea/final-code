import { join } from 'path';

export default {
  server: {
    port: 3000,
  },
  jwt: {
    secret: 'xxxxxxxxxxxxxx', // fs.readFileSync('xxxxx.key')
    expiresIn: '2d', // https://github.com/vercel/ms
  },
  minio: {
    endPoint: '127.0.0.1',
    port: 9000,
    accessKey: 't8xXoqAhzWtpJFWsjnrI',
    secretKey: 'tRQfkaL8Tah5QCXKQjy8JLYNS8KqZ7aYmu4VM2HU',
    useSSL: false,
  },
  redis: {
    client: {
      port: 6379, // Redis port
      host: '127.0.0.1', // Redis host
      password: '',
      db: 0,
    },
  },
  bull: {
    defaultQueueOptions: {
      redis: {
        port: 6379,
        host: '127.0.0.1',
        password: '',
      },
    },
  },
  mysql: {
    client: {
      datasourceUrl: 'mysql://root:123456@localhost:3306/students',
    },
  },
  upload: {
    // fileSize: string, 最大上传文件大小，默认为 10mb
    fileSize: '100mb',
    // whitelist: string[]，文件扩展名白名单
    whitelist: ['.pdf', '.jpg', '.png', '.jpeg'],
    // 本地目录
    targetDir: `${join(process.cwd())}/uploads`,
    // 可用存储桶列表，防止乱创建
    bucketList: ['avatar', 'picture', 'video', 'common'],
    // 启用匿名访问图片模式
    anonymousAccess: true,
    // STORAGE 存储引擎
    storage: 'MINIO', // LOCAL MINIO
  },
};

// const handler = {
//   apply: function(target, thisArg, argumentsList) {
//     console.log(`正在调用函数：${target.name}`);
//     return target.apply(thisArg, argumentsList);
//   }
// };
// function sayHello(name) {
//   console.log(`Hello, ${name}!`);
// }
// const proxy = new Proxy(sayHello, handler);
// proxy("John"); // 输出：正在调用函数：sayHello  Hello, John!
