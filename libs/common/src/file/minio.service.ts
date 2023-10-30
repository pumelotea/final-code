import { Inject, Injectable } from '@nestjs/common';
import {
  FileModuleOptions,
  MODULE_OPTIONS_TOKEN,
} from '@happykit/common/file/file.module-definition';
import { ServiceException } from '@happykit/common/error';
import { nanoid } from 'nanoid';
import * as Minio from 'minio';
import { Readable as ReadableStream } from 'stream';
import { UploadedObjectInfo } from 'minio';
import { CommonFileService } from '@happykit/common/file/file.module-definition';

// minio 文档
// https://min.io/docs/minio/linux/developers/javascript/minio-javascript.html#full-examples
@Injectable()
export class MinioService implements CommonFileService {
  public fileConfig: FileModuleOptions;
  private minioClient: Minio.Client;
  constructor(
    @Inject(MODULE_OPTIONS_TOKEN) private options: FileModuleOptions,
  ) {
    this.fileConfig = this.options;
    this.minioClient = new Minio.Client(this.options.extra);
  }

  async upload(file: Express.Multer.File, bucket: string): Promise<string> {
    await this.makeBucket(bucket);
    const split = file.originalname.split('.');
    if (split.length < 2 || !split[1]) {
      throw new ServiceException('存在文件格式不正确');
    }
    const ext = split[1].toLowerCase();
    const id = nanoid(20);
    const filename = `${id}.${ext}`;
    await this.putObject(bucket, filename, file.buffer);
    return `/${bucket}/${id}${ext}`;
  }

  async view(bucket: string, filename: string): Promise<ReadableStream> {
    return await this.getObject(bucket, filename);
  }

  async makeBucket(bucket: string, region = 'china') {
    const exist = await this.bucketExists(bucket);
    if (exist) {
      return {
        bucket,
        region,
      };
    }
    return await new Promise((resolve, reject) => {
      this.minioClient.makeBucket(bucket, region, (err) => {
        if (err) {
          reject(
            new ServiceException(`${bucket}存储桶在${region}区域创建失败`),
          );
        }

        resolve({
          bucket,
          region,
        });
      });
    });
  }

  async bucketExists(bucket: string): Promise<boolean> {
    return await new Promise((resolve) => {
      this.minioClient.bucketExists(bucket, (err, exists) => {
        if (err) {
          resolve(false);
        }
        resolve(exists);
      });
    });
  }

  async putObject(
    bucket: string,
    objectName: string,
    fileStream: Buffer,
  ): Promise<UploadedObjectInfo> {
    return await new Promise((resolve, reject) => {
      this.minioClient.putObject(
        bucket,
        objectName,
        fileStream,
        (err, objInfo) => {
          if (err) {
            reject(new ServiceException('上传失败'));
          }
          resolve(objInfo);
        },
      );
    });
  }

  async getObject(bucket: string, objectName: string): Promise<ReadableStream> {
    return await new Promise((resolve, reject) => {
      this.minioClient.getObject(bucket, objectName, (err, dataStream) => {
        if (err) {
          reject(new ServiceException(`读取文件失败(${err.message})`));
        }
        resolve(dataStream);
      });
    });
  }
}
