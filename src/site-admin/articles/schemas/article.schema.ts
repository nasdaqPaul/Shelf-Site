import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import * as mongoose from 'mongoose';

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
  @Prop({
    type: mongoose.Schema.Types.ObjectId, ref: 'Author'
  })
  author: User;
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
