import {
  IsArray,
  IsDate,
  IsDateString,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateArticleDto {
  @IsUUID()
  id: string;
  @IsString()
  title: string;
  @IsArray()
  content: any;
  @IsDateString()
  created: Date;
  @IsDateString()
  updated: Date;
}
