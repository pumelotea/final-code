import { Inject, Injectable } from '@nestjs/common';
import {
  CommonFileService,
  FileModuleOptions,
  MODULE_OPTIONS_TOKEN,
} from '@happykit/common/file/file.module-definition';
import * as fs from 'fs';
import * as path from 'path';
import { ServiceException } from '@happykit/common/error';
import { nanoid } from 'nanoid';

@Injectable()
export class FileService implements CommonFileService {
  private readonly targetDir: string;
  public fileConfig: FileModuleOptions;
  constructor(
    @Inject(MODULE_OPTIONS_TOKEN) private options: FileModuleOptions,
  ) {
    this.targetDir = options.targetDir;
    this.fileConfig = options;
  }

  async upload(file: Express.Multer.File, bucket: string): Promise<string> {
    const targetDir = `${this.targetDir}/${bucket}`;
    this.mkdirSync(targetDir);
    const split = file.originalname.split('.');
    if (split.length < 2 || !split[1]) {
      throw new ServiceException('存在文件格式不正确');
    }

    const ext = split[1].toLowerCase();
    const id = nanoid(20);
    const target = `${targetDir}/${id}.${ext}`;
    fs.writeFileSync(target, file.buffer);
    return `/${bucket}/${id}${ext}`;
  }

  async view(bucket: string, filename: string): Promise<Buffer> {
    const targetDir = `${this.targetDir}`;
    try {
      return fs.readFileSync(`${targetDir}/${bucket}/${filename}`);
    } catch (error) {
      throw new ServiceException('读取文件失败');
    }
  }

  mkdirSync(dirname: string) {
    if (fs.existsSync(dirname)) {
      return true;
    } else {
      if (this.mkdirSync(path.dirname(dirname))) {
        fs.mkdirSync(dirname);
        return true;
      }
    }
  }
}
