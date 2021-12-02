import { Injectable } from '@nestjs/common';
import { CreateSeriesDto } from './dto/create-series.dto';
import { UpdateSeriesDto } from './dto/update-series.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Series, SeriesDocument } from './schemas/series.schema';
import { Model } from 'mongoose';
import { join } from 'path';
import StorageService from '../services/storage.service';

@Injectable()
export class SeriesService {
  private mediaDirName = 'series';
  constructor(
    @InjectModel(Series.name) private seriesModel: Model<SeriesDocument>,
    private storageService: StorageService,
  ) {}

  async create(createSeriesDto: CreateSeriesDto) {
    await this.seriesModel.create(createSeriesDto);
    await this.storageService.createMediaDir(
      join(this.mediaDirName, createSeriesDto.id),
    );
  }

  findAll() {
    return this.seriesModel.find({});
  }

  findOne(id: string) {
    return this.seriesModel.findById(id);
  }

  update(id: number, updateSeriesDto: UpdateSeriesDto) {
    return `This action updates a #${id} series`;
  }

  async remove(id: string) {
    await this.seriesModel.deleteOne({ id });
    await this.storageService.deleteMediaDir(join(this.mediaDirName, id));
  }
}
