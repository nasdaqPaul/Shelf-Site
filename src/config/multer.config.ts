import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export async function factoryFunction(
  configService: ConfigService,
): Promise<MulterOptions> {
  return {
    limits: {
      fileSize: 1000000,
    },
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.startsWith('image')) {
        cb(new BadRequestException('Only image files are supported'), false);
      }
      cb(null, true);
    },
  };
}
