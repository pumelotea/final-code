import { Prisma, PrismaClient } from '@prisma/client';

type FlatTransactionClient = Prisma.TransactionClient & {
  $commit: () => Promise<void>;
  $rollback: () => Promise<void>;
};

const ROLLBACK = { [Symbol.for('prisma.client.extension.rollback')]: true };

const prisma = new PrismaClient({ log: ['query'] }).$extends({
  client: {
    async $begin() {
      const prisma = Prisma.getExtensionContext(this);
      let setTxClient: (txClient: Prisma.TransactionClient) => void;
      let commit: () => void;
      let rollback: () => void;

      // a promise for getting the tx inner client
      const txClient = new Promise<Prisma.TransactionClient>((res) => {
        setTxClient = (txClient) => res(txClient);
      });

      // a promise for controlling the transaction
      const txPromise = new Promise((_res, _rej) => {
        commit = () => _res(undefined);
        rollback = () => _rej(ROLLBACK);
      });

      // opening a transaction to control externally
      if (
        '$transaction' in prisma &&
        typeof prisma.$transaction === 'function'
      ) {
        const tx = prisma.$transaction(async (txClient: any) => {
          setTxClient(txClient as unknown as Prisma.TransactionClient);

          await txPromise;
          // return txPromise.catch((e) => {
          //   if (e === ROLLBACK) {
          //     throw e;
          //   }
          // });
        });

        // return a proxy TransactionClient with `$commit` and `$rollback` methods
        return new Proxy(await txClient, {
          get(target, prop) {
            if (prop === '$commit') {
              return () => {
                commit();
                return tx;
              };
            }
            if (prop === '$rollback') {
              return () => {
                rollback();
                return tx;
              };
            }
            return target[prop as keyof typeof target];
          },
        }) as FlatTransactionClient;
      }

      throw new Error('Transactions are not supported by this client');
    },
  },
});

async function main() {
  const tx = await prisma.$begin();
  await tx.sysRole.create({
    data: {
      roleName: '123123123',
      roleDesc: 'aaaaaaaa',
    },
  });
  // throw new Error('123')
  // await tx.$rollback();
  await tx.$commit();
}

// main()
//   .then(async () => {
//     await prisma.$disconnect();
//   })
//   .catch(async (e) => {
//     console.error(e);
//     await prisma.$disconnect();
//     process.exit(1);
//   });

const Tx = () => {
  return (target: any, name: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;
    async function proxy(this: any, ...args: any[]) {
      // console.log(target.prisma)
      const tx = await prisma.$begin();
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

      const r = await originalMethod.apply(pV, args);
      await tx.$commit();
      return r;
    }
    descriptor.value = proxy;
  };
};

class Test {
  public aaa = prisma;
  public bbb = prisma;
  @Tx() //使用tx之后 不支持手工事务
  async fuck() {
    // const { tx } = this as any;
    // console.log('fucking', Object.keys(tx.sysRole.fields));
    await this.aaa.sysRole.create({
      data: {
        roleName: '123123123',
        roleDesc: 'aaaaaaaa',
      },
    });
    await new Promise(async (resolve)=>{
      await this.bbb.sysRole.create({
        data: {
          roleName: '123123123',
          roleDesc: 'bbbbbbbb',
        },
      });
      resolve(1);
    });

    // await this.aaa.$transaction(async (tx) => {
    //   await tx.sysRole.create({
    //     data: {
    //       roleName: '123123123',
    //       roleDesc: 'ccccccc',
    //     },
    //   });
    // });
    // throw new Error('asd-asd');
  }

  @Tx()
  async ffffk() {
    await this.aaa.sysRole.create({
      data: {
        roleName: 'ffffk',
        roleDesc: 'aaaaaaaa',
      },
    });
    // throw new Error('asd-asd');
  }
}

const test = new Test();

test
  .fuck()
  .then()
  .catch((e) => {
    console.log('=====>', e);
  });


// test.ffffk().then().catch(e=>{
//
// })
