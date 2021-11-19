import { Module } from '@nestjs/common';
import { ArticlesModule } from './articles/articles.module';
import { SeriesModule } from './series/series.module';

@Module({
  imports: [ArticlesModule, SeriesModule],
})
export class SiteAdminModule {}
