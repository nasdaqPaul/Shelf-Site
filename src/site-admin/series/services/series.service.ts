import { Injectable } from '@nestjs/common';
import { CreateSeriesDto } from '../dto/create-series.dto';
import { UpdateSeriesDto } from '../dto/update-series.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Series, SeriesDocument } from '../schemas/series.schema';
import { Model } from 'mongoose';
import { CreateMediaDir } from '../../../shared/createMediaDir';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SeriesService extends CreateMediaDir {
  constructor(
    @InjectModel(Series.name) private seriesModel: Model<SeriesDocument>,
    configService: ConfigService,
  ) {
    super(configService);
    this.folderName = 'series';
  }

  async create(createSeriesDto: CreateSeriesDto) {
    await this.seriesModel.create(createSeriesDto);
    await this.createMediaDir(createSeriesDto.id);
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
    await this.deleteMediaDir(id);
  }
}
