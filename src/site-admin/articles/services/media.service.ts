import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

@Injectable()
export class MediaService {
  constructor(private configService: ConfigService) {}

  private writeFile(articleId: string, file: Express.Multer.File) {
    function generateFileName(file: Express.Multer.File) {
      return file.fieldname + '.' + file.mimetype.split('/')[1];
    }
    const savePath = join(
      this.configService.get<string>('MEDIA_PATH'),
      articleId,
    );
    return new Promise<void>((resolve, reject) => {
      fs.writeFile(
        join(savePath, generateFileName(file)),
        file.buffer,
        function (err) {
          if (err) reject(err);
          resolve();
        },
      );
    });
  }

  async saveImages(articleId: string, files: Array<Express.Multer.File>) {
    const writePromises = files.map((file) => {
      return this.writeFile(articleId, file);
    });
    return Promise.all(writePromises);
  }
}
