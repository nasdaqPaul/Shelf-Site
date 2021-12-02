import { BadRequestException, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SiteAdminModule } from './site-admin/site-admin.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { mongooseFactory } from './config/mongoose.config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    SiteAdminModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: mongooseFactory,
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
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
