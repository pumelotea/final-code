import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from '@happykit/common/file/file.service';
import { JwtService } from '@nestjs/jwt';
import { AuthException, ServiceException } from '@happykit/common/error';
import { MinioService } from '@happykit/common/file/minio.service';
import { CommonFileValidator } from '@happykit/common/file/file.validation';
import { CommonFileService } from '@happykit/common/file/file.module-definition';
import { Readable as ReadableStream } from 'node:stream';
import { ConfigService } from '@nestjs/config';
import { BizLog } from '@happykit/common/decorator/log.decorator';
import { ApiTags } from '@codecoderun/swagger';
import { SkipTransform, Vo } from '@happykit/common/decorator/vo.decorator';
import { FileVo } from '@happykit/common/file/file.vo';

@ApiTags('通用文件')
@Controller('file')
export class FileController {
  private fileService: CommonFileService;
  constructor(
    private fileService1: FileService,
    private minioService: MinioService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    //  切换感觉还可以优化
    const storage = configService.get<string>('upload.storage')!;
    if (storage === 'MINIO') {
      this.fileService = minioService;
    } else {
      this.fileService = fileService1;
    }
  }

  /**
   * 文件上传
   * @param file 文件
   * @param bucket 存储桶
   */
  @Post('/upload/:bucket')
  @UseInterceptors(FileInterceptor('file'))
  @BizLog({ name: '文件', desc: '文件上传' })
  @Vo({ type: FileVo })
  async upload(
    @UploadedFile(CommonFileValidator)
    file: Express.Multer.File,
    @Param('bucket') bucket: string,
  ) {
    const bucketList = this.fileService.fileConfig.bucketList;
    if (!bucketList.includes(bucket)) {
      throw new ServiceException('存储桶不存在');
    }
    return {
      path: this.fileService.upload(file, bucket),
    };
  }

  /**
   * 文件获取
   * @param bucket
   * @param filename
   * @param token
   */
  @Get('/access/:bucket/:filename')
  @BizLog({ name: '文件', desc: '文件预览' })
  @SkipTransform()
  async view(
    @Param('bucket') bucket: string,
    @Param('filename') filename: string,
    @Query('token') token?: string,
  ) {
    const anonymousAccess = this.fileService.fileConfig.anonymousAccess;
    // 开启授权访问模式，要求图片路径后面携带token
    if (!anonymousAccess) {
      try {
        this.jwtService.verify(token!);
      } catch (error) {
        throw new AuthException('失败');
      }
    }
    return new StreamableFile(
      (await this.fileService.view(bucket, filename)) as ReadableStream,
    );
  }
}
