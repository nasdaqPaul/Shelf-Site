import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from '../dto/create-article.dto';
import { UpdateArticleDto } from '../dto/update-article.dto';
import { Model } from 'mongoose';
import { Article, ArticleDocument } from '../schemas/article.schema';
import { InjectModel } from '@nestjs/mongoose';
import { join } from 'path';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<ArticleDocument>,
    private configService: ConfigService,
  ) {}
  private createArticleMediaDir(id: string) {
    const dirName = join(this.configService.get<string>('MEDIA_PATH'), id);
    return new Promise<void>((resolve, reject) => {
      fs.mkdir(dirName, { recursive: true }, (err) => {
        if (err) reject(err);
        resolve();
      });
    });
  }
  private deleteArticleMediaDir(id: string) {
    const dirName = join(this.configService.get<string>('MEDIA_PATH'), id);
    return new Promise<void>((resolve, reject) => {
      fs.rm(dirName, { recursive: true, force: true }, (err) => {
        if (err) reject(err);
        resolve();
      });
    });
  }
  async create(createArticleDto: CreateArticleDto) {
    await this.articleModel.create(createArticleDto);
    await this.createArticleMediaDir(createArticleDto.id);
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
    await this.deleteArticleMediaDir(id);
  }
}
