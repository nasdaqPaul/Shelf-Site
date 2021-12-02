import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Response,
  StreamableFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { SeriesService } from './series.service';
import { CreateSeriesDto } from './dto/create-series.dto';
import { UpdateSeriesDto } from './dto/update-series.dto';
import { join } from 'path';
import StorageService from '../services/storage.service';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

@Controller('series')
export class SeriesController {
  private mediaDirName = 'series';

  constructor(
    private readonly seriesService: SeriesService,
    private storageService: StorageService,
  ) {}

  @Post()
  async upload(@Body() createSeriesDto: CreateSeriesDto) {
    try {
      await this.seriesService.create(createSeriesDto);
    } catch (e) {
      if (e.code === 11000) {
        throw new ConflictException(
          `Series with ID '${createSeriesDto.id}' already exits in this site`,
        );
      }
    }
  }

  @Get()
  findAll() {
    return this.seriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.seriesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSeriesDto: UpdateSeriesDto) {
    return this.seriesService.update(+id, updateSeriesDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.seriesService.remove(id);
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
