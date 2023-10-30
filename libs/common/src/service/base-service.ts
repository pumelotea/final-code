import { paginate } from 'nestjs-prisma-pagination';

export abstract class BaseService<T> {
  protected abstract model(): any;

  async create(data: Partial<T>): Promise<T> {
    return this.model().create({
      data,
    });
  }

  async findAll(where?: Partial<T>): Promise<T[]> {
    return this.model().findMany({
      where,
    });
  }

  async findPage(page = 1, limit = 10, where?: Partial<T>): Promise<T[]> {
    const query = paginate(
      {
        page,
        limit,
        // from: '2023-01-01T00:00:00.000Z',
        // to: '2023-12-31T22:59:59.000Z',
        // search: 'foo',
      },
      {
        // dateAttr: 'at',
        // enabled: false,
        // includes: ['post', 'user.agent.auth'],
        // search: ['fullname', 'reference'],
        orderBy: {},
      },
    );
    query.where = where;
    return this.model().findMany(query);
  }

  async findOne(id: number): Promise<T> {
    return this.model().findFirst({
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

  async remove(where?: Partial<T>): Promise<T> {
    return this.model().delete({
      where,
    });
  }
}
