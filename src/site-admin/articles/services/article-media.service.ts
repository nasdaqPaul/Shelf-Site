import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MediaService } from '../../../shared/media.service';

@Injectable()
export class ArticleMediaService extends MediaService {
  constructor(configService: ConfigService) {
    super(configService);
    this.folderName = 'articles';
  }
}
