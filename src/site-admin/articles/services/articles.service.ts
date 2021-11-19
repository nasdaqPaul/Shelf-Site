import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from '../dto/create-article.dto';
import { UpdateArticleDto } from '../dto/update-article.dto';
import { Model } from 'mongoose';
import { Article, ArticleDocument } from '../schemas/article.schema';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { CreateMediaDir } from '../../../shared/createMediaDir';

@Injectable()
export class ArticlesService extends CreateMediaDir {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<ArticleDocument>,
    configService: ConfigService,
  ) {
    super(configService);
    this.folderName = 'articles';
  }

  async create(createArticleDto: CreateArticleDto) {
    await this.articleModel.create(createArticleDto);
    await this.createMediaDir(createArticleDto.id);
  }

  findAll() {
    return this.articleModel.find({}, { __v: 0 });
  }

  findOne(id: string) {
    return this.articleModel.findById(id);
  }

  update(id: number, updateArticleDto: UpdateArticleDto) {
    return `This action updates a #${id} article`;
  }

  async remove(id: string) {
    await this.articleModel.findByIdAndRemove(id);
    await this.deleteMediaDir(id);
  }
}
