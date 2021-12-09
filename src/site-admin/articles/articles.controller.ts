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
  Response,
  StreamableFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import StorageService from '../services/storage.service';
import { join } from 'path';
import { AuthGuard } from '@nestjs/passport';
import { Roles, RolesGuard } from '../../auth/guards/roles-guard';
import { UserRole } from '../users/schemas/user.schema';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

// @UseGuards(JwtAuthGuard)
@Controller('articles')
export class ArticlesController {
  private mediaDirName = 'articles';

  constructor(
    private readonly articlesService: ArticlesService,
    private storageService: StorageService,
  ) {
  }

  @Roles(UserRole.Admin, UserRole.Author)
  @UseGuards(RolesGuard)
  @Post()
  async create(@Body() createArticleDto: CreateArticleDto) {
    try {
      await this.articlesService.create(createArticleDto);
    } catch (e) {
      if (e.code === 11000) {
        throw new ConflictException(
          `An article with ID '${createArticleDto.id}' already exists in this site.`,
        );
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
  async uploadFiles(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Param('id') id: string,
  ) {
    await this.storageService.saveFiles(join(this.mediaDirName, id), files);
  }

  @Get(':id/media/:fileName')
  async getFile(
    @Param('id') id: string,
    @Param('fileName') fileName: string,
    @Response({ passthrough: true }) res,
  ) {
    const fileReadStream = await this.storageService.getFileReadStream(
      join(this.mediaDirName, id),
      fileName,
    );

    res.set({
      'Content-Type': 'image/' + fileReadStream.fileExtension,
      'Content-Disposition': 'inline',
    });
    return new StreamableFile(fileReadStream.readStream);
  }
}
