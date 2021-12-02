import { Injectable, NotFoundException } from '@nestjs/common';
import { join } from 'path';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export default class StorageService {
  constructor(private configService: ConfigService) {}

  createMediaDir(dirName: string) {
    const fullPath = join(
      this.configService.get<string>('MEDIA_PATH'),
      dirName,
    );
    return new Promise<void>((resolve, reject) => {
      fs.mkdir(fullPath, { recursive: true }, (err) => {
        if (err) reject(err);
        resolve();
      });
    });
  }

  deleteMediaDir(dirName: string) {
    const fullPath = join(
      this.configService.get<string>('MEDIA_PATH'),
      dirName,
    );
    return new Promise<void>((resolve, reject) => {
      fs.rm(fullPath, { recursive: true, force: true }, (err) => {
        if (err) reject(err);
        resolve();
      });
    });
  }

  private writeFile(dirName: string, file: Express.Multer.File) {
    function generateFileName(file: Express.Multer.File) {
      return file.fieldname + '.' + file.mimetype.split('/')[1];
    }

    const fullPath = join(
      this.configService.get<string>('MEDIA_PATH'),
      dirName,
    );
    return new Promise<void>((resolve, reject) => {
      fs.writeFile(
        join(fullPath, generateFileName(file)),
        file.buffer,
        function (err) {
          if (err) reject(err);
          resolve();
        },
      );
    });
  }

  async saveFiles(dirName: string, files: Array<Express.Multer.File>) {
    const writePromises = files.map((file) => {
      return this.writeFile(dirName, file);
    });
    return Promise.all(writePromises);
  }

  getFileReadStream(dirName: string, fileName: string) {
    const fullPath = join(
      this.configService.get<string>('MEDIA_PATH'),
      dirName,
    );

    return new Promise<{
      fullFileName: string;
      readStream: fs.ReadStream;
      fileExtension: string;
    }>((resolve, reject) => {
      let fullFileName;
      fs.readdir(fullPath, function (err, files) {
        if (err) reject(err);
        for (const file of files) {
          if (file.startsWith(fileName)) {
            fullFileName = file;
            break;
          }
        }
        if (!fullFileName) reject(new NotFoundException('File Not Found'));
        resolve({
          fullFileName,
          readStream: fs.createReadStream(join(fullPath, fullFileName)),
          fileExtension: fullFileName.split('.')[1],
        });
      });
    });
  }
}
