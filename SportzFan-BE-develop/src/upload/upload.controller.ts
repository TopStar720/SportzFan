import {
  BadRequestException,
  Controller,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ApiImplicitParam } from '@nestjs/swagger/dist/decorators/api-implicit-param.decorator';

import * as uuid from 'uuid';
import * as Jimp from 'jimp';

import { ApiFile } from '../common/decorators/api-file.decorator';
import { UploadService } from './upload.service';
import { UploadResponse } from '../common/models/upload';
import { getFileExtension } from '../common/utils/common.util';

@ApiTags('File Management')
@Controller('upload')
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Post(':path')
  @ApiOkResponse({ type: UploadResponse })
  @ApiConsumes('multipart/form-data')
  @ApiImplicitParam({ name: 'path', required: true })
  @ApiFile()
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @Param('path') path,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 })],
      }),
    )
    file,
  ): Promise<UploadResponse> {
    return this._upload(file, path, uuid.v4());
  }

  private async _upload(
    file,
    bucket: string,
    targetFileName: string,
  ): Promise<UploadResponse> {
    try {
      const meta = {} as any;
      if (
        file.originalname.endsWith('.jpg') ||
        file.originalname.endsWith('.png') ||
        file.originalname.endsWith('.jpeg')
      ) {
        const f = await Jimp.read(file.buffer);
        meta.width = `${f.getWidth()}`;
        meta.height = `${f.getHeight()}`;
      }
      const fileExtension = getFileExtension(file.originalname);
      const url = await this.uploadService.uploadToS3(
        file,
        `${bucket}/${targetFileName}${fileExtension}`,
        meta,
      );
      return { url };
    } catch (e) {
      throw new BadRequestException('Failed to upload file');
    }
  }
}
