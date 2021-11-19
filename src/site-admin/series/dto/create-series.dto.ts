import {
  IsArray,
  IsDateString,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class SeriesArticle {
  @IsUUID()
  id: string;
  @IsObject()
  @IsOptional()
  site?: any;
}
export class CreateSeriesDto {
  @IsUUID()
  id: string;
  @IsString()
  title: string;
  @IsArray()
  description: any[];
  @ValidateNested({ each: true })
  @Type(() => SeriesArticle)
  articles: SeriesArticle[];
  @IsDateString()
  created: string;
  @IsDateString()
  updated: string;
}
