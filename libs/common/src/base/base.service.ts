export interface Options {
  select?: unknown;

  include?: unknown;

  sort?: unknown;

  pageNo?: number;

  pageSize?: number;
}

export abstract class BaseService<T> {
  protected abstract model: any;

  public async create(data: Partial<T>): Promise<T> {
    return await this.model.create({ data });
  }
  public async findAll(where: Partial<T>): Promise<T[]> {
    return await this.model.findMany({
      where: {
        ...where,
        deleted: null,
      },
    });
  }
  public async findPage(
    where: Partial<T>,
    options: Partial<Options>,
  ): Promise<{ list: T[]; total: number }> {
    const {
      select,
      include,
      sort = { id: 'desc' },
      pageNo = 1,
      pageSize = 20,
    } = options;
    const orderBy = typeof sort === 'string' ? JSON.parse(sort) : sort;
    const skip = (Number(pageNo) - 1) * Number(pageSize);
    const take = Number(pageSize);
    const [list, count] = await Promise.all([
      this.model.findMany({
        where: {
          ...where,
          deleted: null,
        },
        select,
        include,
        orderBy,
        skip,
        take,
      }),
      this.model.count({
        where: {
          ...where,
          deleted: null,
        },
      }),
    ]);
    return {
      list,
      total: count,
    };
  }

  public async findById(id: string, options?: Partial<Options>): Promise<T> {
    const { select, include } = options || {};
    return await this.model.findUnique({
      where: { id, deleted: null },
      select,
      include,
    });
  }

  public async findOne(
    where: Partial<T>,
    options: Partial<Options>,
  ): Promise<T> {
    const { select, include } = options;
    return await this.model.findFirst({
      where: {
        ...where,
        deleted: null,
      },
      select,
      include,
    });
  }

  public async updateOne(where: Partial<T>, data: Partial<T>) {
    return await this.model.update({
      where: {
        ...where,
        deleted: null,
      },
      data,
    });
  }

  public async deleteById(id: string): Promise<T> {
    return await this.model.delete({ where: { id } });
  }
}
