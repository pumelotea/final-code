import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileModuleOptions } from '@happykit/common/file/file.module-definition';
import { ServiceException } from '@happykit/common/error';
import filesizeParser from '@happykit/common/utils/filesizeParser';

@Injectable()
export class CommonFileValidator implements PipeTransform {
  private readonly opt: FileModuleOptions;
  constructor(private configService: ConfigService) {
    this.opt = this.configService.get<FileModuleOptions>('upload')!;
  }
  transform(file: Express.Multer.File) {
    // "value" is an object containing the file's attributes and metadata
    if (!file) {
      throw new ServiceException('文件不能为空');
    }
    if (file.size > filesizeParser(this.opt.fileSize)) {
      throw new ServiceException(`文件大小超出限制(${this.opt.fileSize})`);
    }
    return file;
  }
}
