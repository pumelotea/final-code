#!/usr/bin/env ts-node
import { join } from 'path';
import * as NestCliConfig from './nest-cli.json';
import * as JSONSchema from './prisma/json-schema/json-schema.json';
import * as fs from 'fs';
import * as path from 'path';
import cac from 'cac';
import { exec } from 'child_process';

// input
let projectName = '';
let model = '';

// runtime env
const BASE_FILED_LIST = [
  'createdAt',
  'createdBy',
  'updatedAt',
  'updatedBy',
  'deleted',
  'deletedBy',
];

const typeMap: Record<string, string> = { integer: 'number' };
let project: any;
let sourceRoot: string;
let modelProperties: any;

function isArray(value: any): boolean {
  return value instanceof Array;
}

function getProps() {
  const propList = [];
  for (const modelPropertiesKey in modelProperties) {
    const { type, description } = modelProperties[modelPropertiesKey];
    let isOptional = false;
    let propType = '';
    if (isArray(type) && type.length >= 2 && type[1] === 'null') {
      isOptional = true;
      propType = `${type[0]}`;
    } else {
      propType = type;
    }
    propList.push({
      pk: modelPropertiesKey,
      propType,
      description,
      isOptional,
    });
  }
  return propList;
}

function classGenerator(name: string, body: string, ext: string = '') {
  return `
export class ${name} ${ext ? 'extends ' + ext + ' ' : ''}{
${body}
}`;
}

export function importGenerator(NAMES: string, MODULE: string) {
  return `import { ${NAMES} } from ${MODULE};`;
}

function getType(rawType: string) {
  if (typeMap[rawType]) {
    return typeMap[rawType];
  }
  return rawType;
}

function makeCreateDto(propList: any[]) {
  //DTO 不需要id
  propList = propList.filter((e) => e.pk !== 'id');
  const hasIsOptional =
    propList.filter((e) => e.isOptional && !BASE_FILED_LIST.includes(e.pk))
      .length > 0;
  const hasIsNotEmpty =
    propList.filter((e) => !e.isOptional && !BASE_FILED_LIST.includes(e.pk))
      .length > 0;
  const names = [];
  if (hasIsOptional) {
    names.push('IsOptional');
  }
  if (hasIsNotEmpty) {
    names.push('IsNotEmpty');
  }
  const importCode = importGenerator(names.join(', '), `'class-validator'`);

  let body = '';
  propList.forEach(({ pk, propType, description, isOptional }) => {
    if (BASE_FILED_LIST.includes(pk) || pk === 'id') {
      return;
    }
    if (description) {
      body += `  /**
   * ${description}
   */\n`;
    }
    if (isOptional) {
      body += `  @IsOptional()\n`;
    } else {
      body += `  @IsNotEmpty({ message: '${description ?? ''}不能为空' })\n`;
    }
    body += `  ${pk}${isOptional ? '?' : ''}: ${getType(propType)};\n`;
  });
  return `${importCode}
${classGenerator(`Create${model}Dto`, body)}`;
}

function toSnake(str: string) {
  return (
    str &&
    str
      .match(
        /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g,
      )!
      .map((s) => s.toLowerCase())
      .join('-')
  );
}

function makeUpdateDto() {
  return `import { PartialType } from '@codecoderun/swagger';
import { Create${model}Dto } from './create-${toSnake(model)}.dto';

export class Update${model}Dto extends PartialType(Create${model}Dto) {}
`;
}

function makeVo(propList: any[]) {
  let body = '';
  propList.forEach(({ pk, propType, description }) => {
    if (BASE_FILED_LIST.includes(pk)) {
      return;
    }
    if (description) {
      body += `  /**
   * ${description}
   */\n`;
    }
    body += `  ${pk}: ${getType(propType)};\n`;
  });
  return `import { BaseVo } from '@happykit/common/base/base.vo';
${classGenerator(`${model}Vo`, body, 'BaseVo')}`;
}

function makeModule() {
  return `import { Module } from '@nestjs/common';
import { ${model}Service } from './${toSnake(model)}.service';
import { ${model}Controller } from './${toSnake(model)}.controller';

@Module({
  controllers: [${model}Controller],
  providers: [${model}Service],
})
export class ${model}Module {}
`;
}

function makeService() {
  return `import { Injectable } from '@nestjs/common';
import { BaseService } from '@happykit/common/base/base.service';
import { ${model} } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class ${model}Service extends BaseService<${model}> {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  protected get model() {
    return this.prisma.${
      model.substring(0, 1).toLowerCase() + model.substring(1)
    };
  }
}
`;
}

function makeController(controllerName: string) {
  const cName = model.substring(0, 1).toLowerCase() + model.substring(1);
  return `import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ${model}Service } from './${toSnake(model)}.service';
import { Create${model}Dto } from './dto/create-${toSnake(model)}.dto';
import { Update${model}Dto } from './dto/update-${toSnake(model)}.dto';
import { ApiTags } from '@codecoderun/swagger';
import { AutoVo, VoType } from '@happykit/common/decorator/vo.decorator';
import { ${model}Vo } from './vo/${toSnake(model)}.vo';
import { ServiceException } from '@happykit/common/error';
import { BizLog } from '@happykit/common/decorator/log.decorator';

@Controller('${toSnake(model)}')
@ApiTags('${controllerName}')
export class ${model}Controller {
  constructor(private readonly ${cName}Service: ${model}Service) {}

  /**
   * 创建${controllerName}
   */
  @Post()
  @AutoVo({ type: ${model}Vo })
  @BizLog({ name: '${controllerName}', desc: '创建${controllerName}' })
  async create(@Body() create${model}Dto: Create${model}Dto) {
    return await this.${cName}Service.create(create${model}Dto);
  }

  /**
   * ${controllerName}分页
   */
  @Get()
  @AutoVo({ type: ${model}Vo, voType: VoType.PAGE })
  @BizLog({ name: '${controllerName}', desc: '查询${controllerName}分页' })
  async findPage(
    @Query('pageNo') pageNo: number,
    @Query('pageSize') pageSize: number,
  ) {
    return await this.${cName}Service.findPage(
      {},
      {
        pageNo,
        pageSize,
      },
    );
  }

  /**
   * ${controllerName}详情
   */
  @Get(':id')
  @AutoVo({ type: ${model}Vo })
  @BizLog({ name: '${controllerName}', desc: '查询${controllerName}详情' })
  async findOne(@Param('id') id: string) {
    const data = await this.${cName}Service.findById(id);
    if (!data) {
      throw new ServiceException('数据未找到');
    }
    return data;
  }

  /**
   * 更新${controllerName}
   */
  @Patch(':id')
  @AutoVo({ type: ${model}Vo })
  @BizLog({ name: '${controllerName}', desc: '更新${controllerName}' })
  async update(
    @Param('id') id: string,
    @Body() update${model}Dto: Update${model}Dto,
  ) {
    return await this.${cName}Service.updateOne({ id }, update${model}Dto);
  }

  /**
   * 删除${controllerName}
   */
  @Delete(':id')
  @AutoVo({ type: ${model}Vo })
  @BizLog({ name: '${controllerName}', desc: '删除${controllerName}' })
  async remove(@Param('id') id: string) {
    return await this.${cName}Service.deleteById(id);
  }
}
`;
}

function mkdirSync(dirname: string) {
  if (fs.existsSync(dirname)) {
    return true;
  } else {
    if (mkdirSync(path.dirname(dirname))) {
      fs.mkdirSync(dirname);
      return true;
    }
  }
}

function exportFile(path: string, fileName: string, content: string) {
  const file = `${path}/${fileName}`;
  if (fs.existsSync(file)) {
    console.log('跳过创建:', file, '❌  ');
    return;
  }
  mkdirSync(path);
  fs.writeFileSync(file, content);
  console.log('创建文件:', file, '✅    ');
}

function generate(pName: string, m: string, cName: string) {
  projectName = pName;
  model = m;
  project = (NestCliConfig.projects as any)[projectName];
  if (!project) {
    console.log(`错误:{${pName}}工程不存在。`);
    return;
  }

  sourceRoot = project.sourceRoot;

  modelProperties = (JSONSchema.definitions as any)[model]?.properties;
  if (!modelProperties) {
    console.log(`错误:Prisma{${m}}模型不存在。`);
    return;
  }

  const props = getProps();
  const createDtoCode = makeCreateDto(props);
  exportFile(
    join(sourceRoot, toSnake(model), 'dto'),
    `create-${toSnake(model)}.dto.ts`,
    createDtoCode,
  );

  const updateDtoCode = makeUpdateDto();
  exportFile(
    join(sourceRoot, toSnake(model), 'dto'),
    `update-${toSnake(model)}.dto.ts`,
    updateDtoCode,
  );
  const voCode = makeVo(props);
  exportFile(
    join(sourceRoot, toSnake(model), 'vo'),
    `${toSnake(model)}.vo.ts`,
    voCode,
  );
  const moduleCode = makeModule();
  exportFile(
    join(sourceRoot, toSnake(model)),
    `${toSnake(model)}.module.ts`,
    moduleCode,
  );
  const serviceCode = makeService();
  exportFile(
    join(sourceRoot, toSnake(model)),
    `${toSnake(model)}.service.ts`,
    serviceCode,
  );
  const controllerCode = makeController(cName);
  exportFile(
    join(sourceRoot, toSnake(model)),
    `${toSnake(model)}.controller.ts`,
    controllerCode,
  );
}

function format() {
  const cmd = `prettier --write apps/${projectName}/src/${toSnake(
    model,
  )}/*.ts apps/${projectName}/src/${toSnake(model)}/**/*.ts`;
  exec(cmd, () => {
    console.log('自动格式化完成');
  });
}

const cli = cac('codecoderun');

/**
 * 定义异常处理公共函数
 * @param err
 */
const onError = (err: Error): void => {
  console.error(err.message);
  process.exit(1);
};
// 监听未捕获的异常事件
process.on('uncaughtException', onError);
// 监听Promise未捕获的异常事件
process.on('unhandledRejection', onError);

cli
  // 添加命令 ‘<>’ 中为必填项，'[]'中为选填项
  .command(
    '<project> <model> <controllerName>',
    '使用Model创建CRUD到指定工程下',
  )
  // 添加配置 --force 简写为 -f;
  // 如果目标存在则覆盖
  // .option('-f, --force', 'Overwrite if the target exists')
  // 添加配置 --offline 简写为 -o ;
  // 定义一个动作，传入一个回调函数
  .action((project: string, model: string, controllerName: string) => {
    generate(project, model, controllerName);
    console.log(`CRUD生成结束: 工程:${project} 模型:${model}`);
    console.log('请前往工程对应的主模块中引入生成的模块');
    format();
  })
  .cli.command('model', '列出所有的模型')
  .action(() => {
    Object.keys(JSONSchema.definitions).forEach((e, index) => {
      console.log(index + 1, e);
    });
    console.log('定义的模型未找到？尝试先执行 npx prisma migrate dev .');
  });

// -h, --help出现标志时输出帮助信息。
cli.help();

// -v, --version 出现标志时输出版本号。
cli.version('1.0.0');

cli.parse();
