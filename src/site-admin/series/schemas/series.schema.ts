import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
class SeriesArticle {
  @Prop({ alias: 'id' })
  _id: string;
  @Prop({ type: Object })
  site: any;
}

const SeriesArticleSchema = SchemaFactory.createForClass(SeriesArticle);
SeriesArticleSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
  },
});

@Schema()
export class Series {
  @Prop({
    alias: 'id',
  })
  _id: string;
  @Prop()
  title: string;
  @Prop({ type: [] })
  description: any[];
  @Prop({
    type: [SeriesArticleSchema],
  })
  articles: SeriesArticle[];
  @Prop()
  created: Date;
  @Prop()
  updated: Date;
}

export type SeriesDocument = Series & Document;
export const SeriesSchema = SchemaFactory.createForClass(Series);
