import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
export class Article {
  @Prop({
    alias: 'id',
  })
  _id: string;
  @Prop()
  title: string;
  @Prop({
    type: Array,
  })
  content: any[];
  @Prop()
  created: Date;
  @Prop()
  updated: Date;
}

export type ArticleDocument = Article & Document;
export const ArticleSchema = SchemaFactory.createForClass(Article).set(
  'toJSON',
  {
    transform: function (doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    },
  },
);
