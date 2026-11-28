import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type VideoDocument = Video & Document;

@Schema({ timestamps: true })
export class Video {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ required: true })
  thumbnailUrl: string;

  @Prop({ required: true })
  videoUrl: string;

  @Prop({ default: '03:00' })
  duration: string;

  @Prop({ default: 'Chăm sóc', index: true })
  category: string;

  @Prop({ default: 'Cơ bản', enum: ['Cơ bản', 'Trung bình', 'Nâng cao'] })
  level: string;

  @Prop({ default: () => new Date().toISOString() })
  publishedAt: string;
}

export const VideoSchema = SchemaFactory.createForClass(Video);
