import { join } from 'path';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';

export abstract class CreateMediaDir {
  protected folderName!: string;

  constructor(protected configService: ConfigService) {}

  protected createMediaDir(id: string) {
    const dirName = join(
      this.configService.get<string>('MEDIA_PATH'),
      this.folderName,
      id,
    );
    return new Promise<void>((resolve, reject) => {
      fs.mkdir(dirName, { recursive: true }, (err) => {
        if (err) reject(err);
        resolve();
      });
    });
  }

  protected deleteMediaDir(id: string) {
    const dirName = join(
      this.configService.get<string>('MEDIA_PATH'),
      this.folderName,
      id,
    );
    return new Promise<void>((resolve, reject) => {
      fs.rm(dirName, { recursive: true, force: true }, (err) => {
        if (err) reject(err);
        resolve();
      });
    });
  }
}
