import { PrismaClient } from '@prisma/client';
import { PrismaService } from '@happykit/common/prisma/prisma.service';

export const Transaction = () => {
  return (target: any, name: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;
    async function proxy(this: any, ...args: any[]) {
      // 寻找prisma
      const service: PrismaService[] = [];
      Object.keys(this).forEach((k) => {
        const o = this[k] instanceof PrismaService;
        if (o) {
          service.push(this[k]);
        }
      });
      if (service.length === 0) {
        return;
      }

      const prisma = service[0];

      // console.log(target.prisma)
      const tx = await prisma.startTransaction();
      // console.log(this.aaa instanceof PrismaClient)
      const keys: string[] = [];
      Object.keys(this).forEach((k) => {
        const o = this[k] instanceof PrismaClient;
        if (o) {
          keys.push(k);
        }
      });

      const pV = new Proxy(this, {
        get(target, prop) {
          if (keys.includes(prop as string)) {
            return tx;
          }
          return target[prop as keyof typeof target];
        },
      });

      try {
        const r = await originalMethod.apply(pV, args);
        await tx.$commit();
        return r;
      } catch (e) {
        await tx.$rollback(e);
        // throw e;
      }
    }
    descriptor.value = proxy;
  };
};
