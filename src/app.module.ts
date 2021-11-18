import { BadRequestException, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SiteAdminModule } from './site-admin/site-admin.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Module({
  imports: [
    SiteAdminModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        uri: `mongodb://localhost:27017`,
        dbName: config.get<string>('DB_NAME'),
        user: config.get<string>('DB_USER'),
        pass: config.get<string>('DB_PASS'),
        authSource: config.get<string>('DB_AUTH_SOURCE'),
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MulterModule.register({
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image')) {
          cb(new BadRequestException('Only image files are supported'), false);
        }
        cb(null, true);
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
