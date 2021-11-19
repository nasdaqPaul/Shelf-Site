import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ArticlesService } from './services/articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleMediaService } from './services/article-media.service';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

@Controller('articles')
export class ArticlesController {
  constructor(
    private readonly articlesService: ArticlesService,
    private mediaService: ArticleMediaService,
  ) {}

  @Post()
  async create(@Body() createArticleDto: CreateArticleDto) {
    try {
      await this.articlesService.create(createArticleDto);
    } catch (e) {
      if (e.code === 11000) {
        throw new ConflictException('Article with already exits');
      }
    }
  }

  @Get()
  async findAll() {
    return this.articlesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const article = await this.articlesService.findOne(id);
    if (!article) {
      throw new NotFoundException('Article with id was not found');
    } else return article;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
    return this.articlesService.update(+id, updateArticleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.articlesService.remove(id);
  }

  @Post(':id/media')
  @UseInterceptors(AnyFilesInterceptor())
  async uploadFile(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Param('id') id: string,
  ) {
    await this.mediaService.saveImages(id, files);
  }
}
