import { Prisma } from '@prisma/client';

export interface Paginate<T> {
  pageNo: number;
  pageSize: number;
  list: T[];
  totalPage: number;
}
export abstract class BaseService<T> {
  protected abstract model(): any;

  async create(data: Partial<T>): Promise<T> {
    return this.model().create({
      data,
    });
  }

  async findList(where?: Partial<T>, orderBy?: Partial<T>): Promise<T[]> {
    return this.model().findMany({
      where,
      orderBy,
    });
  }

  async findPage(
    pageNo = 1,
    pageSize = 10,
    where?: Partial<T>,
    orderBy?: Partial<T>,
  ): Promise<Paginate<T>> {
    pageNo = pageNo < 0 ? 0 : pageNo;
    pageSize = pageSize < 0 ? 10 : pageSize;

    const c = await this.model().count({
      where,
    });

    const res = await this.model().findMany({
      where,
      take: pageSize,
      skip: (pageNo - 1) * pageSize,
      orderBy,
    });

    return {
      list: res as T[],
      pageNo,
      pageSize,
      totalPage: Math.ceil(c / pageSize),
    };
  }

  async findById(id: number): Promise<T> {
    return this.model().findUnique({
      where: {
        id,
      },
    });
  }

  async update(data: Partial<T>, where?: Partial<T>): Promise<T> {
    return this.model().update({
      data,
      where,
    });
  }

  async removeById(id: number): Promise<T> {
    return this.model().delete({
      where: {
        id,
      },
    });
  }
}
