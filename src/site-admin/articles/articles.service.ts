import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Model } from 'mongoose';
import { Article, ArticleDocument } from './schemas/article.schema';
import { InjectModel } from '@nestjs/mongoose';
import StorageService from '../services/storage.service';
import { join } from 'path';

@Injectable()
export class ArticlesService {
  private dirName = 'articles';

  constructor(
    @InjectModel(Article.name) private articleModel: Model<ArticleDocument>,
    private storageService: StorageService,
  ) {}

  async create(createArticleDto: CreateArticleDto) {
    await this.articleModel.create(createArticleDto);
    await this.storageService.createMediaDir(
      join(this.dirName, createArticleDto.id),
    );
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
    await this.storageService.deleteMediaDir(join(this.dirName, id));
  }
}
