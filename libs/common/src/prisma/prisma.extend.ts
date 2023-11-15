import { Prisma } from '@prisma/client';
type FlatTransactionClient = Prisma.TransactionClient & {
  $commit: () => Promise<void>;
  $rollback: (err?: Error) => Promise<void>;
};

export const PrismaTxExtend = {
  client: {
    async $begin() {
      const prisma = Prisma.getExtensionContext(this);
      let setTxClient: (txClient: Prisma.TransactionClient) => void;
      let commit: () => void;
      let rollback: (error?: Error) => void;

      // a promise for getting the tx inner client
      const txClient = new Promise<Prisma.TransactionClient>((res) => {
        setTxClient = (txClient) => res(txClient);
      });

      // a promise for controlling the transaction
      const txPromise = new Promise((_res, _rej) => {
        commit = () => _res(undefined);
        rollback = (error?: Error) => _rej(error ?? new Error('事务回滚'));
      });

      // opening a transaction to control externally
      if (
        '$transaction' in prisma &&
        typeof prisma.$transaction === 'function'
      ) {
        const tx = prisma.$transaction(async (txClient: any) => {
          setTxClient(txClient as unknown as Prisma.TransactionClient);
          console.log('START');
          try {
            await txPromise;
          } catch (e) {
            console.log('ROLLBACK');
            throw e;
          }
          console.log('COMMIT');
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
              return (error?: Error) => {
                rollback(error);
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
};
