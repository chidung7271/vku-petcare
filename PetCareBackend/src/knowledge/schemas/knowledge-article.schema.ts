import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type KnowledgeArticleDocument = KnowledgeArticle & Document;

export enum ArticleCategoryEnum {
  NUTRITION = 'NUTRITION',
  VACCINATION = 'VACCINATION',
  FIRST_AID = 'FIRST_AID',
  HEALTH = 'HEALTH',
  BEHAVIOR = 'BEHAVIOR',
  GROOMING = 'GROOMING',
  EMERGENCY = 'EMERGENCY'
}

@Schema({ timestamps: true })
export class KnowledgeArticle {
  @Prop({ required: true, unique: true, index: true })
  slug: string;

  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, enum: Object.values(ArticleCategoryEnum), index: true })
  category: string;

  @Prop({ required: true })
  summary: string;

  @Prop({ default: '4 phút đọc' })
  readTime: string;

  @Prop({ type: [String], default: [] })
  content: string[];

  @Prop({ default: '' })
  warning?: string;

  @Prop({ required: true })
  source: string;

  @Prop({ default: 'PUBLISHED', enum: ['PUBLISHED', 'DRAFT'] })
  status: string;
}

export const KnowledgeArticleSchema = SchemaFactory.createForClass(KnowledgeArticle);
