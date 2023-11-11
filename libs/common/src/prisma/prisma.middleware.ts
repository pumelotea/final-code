import { Prisma } from '@prisma/client';
import { getCurrentRequest } from '@happykit/common/context/request-context';

export const PrismaMiddleware = async (
  params: Prisma.MiddlewareParams,
  next: any,
) => {
  if (!params.model) {
    return await next(params);
  }

  // 获取基本数据
  const modelName = params.model;
  const module = Prisma.dmmf.datamodel.models.filter(
    (m) => m.name === modelName,
  )[0];
  const fields = module.fields.map((e) => e.name);

  const req = getCurrentRequest();
  let userId = null;
  if (req?.user) {
    userId = `${req.user.id}`;
  }

  // 软删除
  toSoftDelete(params, fields, 'delete', userId);
  toSoftDelete(params, fields, 'deleteMany', userId);
  // 更新用户
  updateUser(params, fields, 'update', 'updatedBy', userId);
  updateUser(params, fields, 'updateMany', 'updatedBy', userId);
  updateUser(params, fields, 'create', 'createdBy', userId);
  updateUser(params, fields, 'createMany', 'createdBy', userId);

  return await next(params);
};

function toSoftDelete(
  params: Prisma.MiddlewareParams,
  fields: string[],
  action: string,
  userId: string | null,
) {
  if (params.action == action) {
    if (action == 'delete') {
      params.action = 'update';
    }
    if (action == 'deleteMany') {
      params.action = 'updateMany';
    }
    if (!params.args.data) {
      params.args.data = {};
    }
    if (fields.includes('deleted')) {
      params.args['data']['deleted'] = new Date();
      params.args['where']['deleted'] = null;
    }
    if (fields.includes('deletedBy')) {
      params.args['data']['deletedBy'] = userId;
    }
  }
  return params;
}

function updateUser(
  params: Prisma.MiddlewareParams,
  fields: string[],
  action: string,
  field: string,
  userId: string | null,
) {
  if (params.action == action) {
    if (!params.args['data'][field]) {
      if (fields.includes(field)) {
        params.args['data'][field] = userId;
      }
    }
  }
  return params;
}
