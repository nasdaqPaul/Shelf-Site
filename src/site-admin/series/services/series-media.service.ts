import { MediaService } from '../../../shared/media.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SeriesMediaService extends MediaService {
  constructor(configService: ConfigService) {
    super(configService);
    this.folderName = 'series';
  }
}
