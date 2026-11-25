import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type CommunityPostDocument = CommunityPost & Document;

@Schema({ timestamps: true })
export class CommunityPost {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true, index: true })
  authorId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true, index: true })
  category: string;

  @Prop({ default: 'article', enum: ['article', 'video', 'tip', 'qa'], index: true })
  postType: string;

  @Prop({ default: '' })
  imageUrl?: string;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ default: '' })
  videoUrl?: string;

  @Prop({ default: '' })
  youtubeId?: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ default: false, index: true })
  isVerifiedByDoctor: boolean;

  @Prop({ default: false, index: true })
  isPinned: boolean;

  @Prop({ default: '' })
  petTag?: string;

  @Prop({ default: 0 })
  likeCount: number;

  @Prop({ default: 0 })
  commentCount: number;

  @Prop({ default: 0 })
  bookmarkCount: number;

  @Prop({ default: 'PUBLISHED', enum: ['PUBLISHED', 'HIDDEN', 'DELETED', 'PENDING_REVIEW'], index: true })
  status: string;
}

export const CommunityPostSchema = SchemaFactory.createForClass(CommunityPost);

// Comment Schema
export type CommentDocument = Comment & Document;

@Schema({ timestamps: true })
export class Comment {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'CommunityPost', required: true, index: true })
  postId: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true, index: true })
  authorId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  content: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

// Like Schema
export type PostLikeDocument = PostLike & Document;

@Schema({ timestamps: true })
export class PostLike {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'CommunityPost', required: true, index: true })
  postId: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;
}

export const PostLikeSchema = SchemaFactory.createForClass(PostLike);
PostLikeSchema.index({ postId: 1, userId: 1 }, { unique: true });

// Bookmark Schema
export type PostBookmarkDocument = PostBookmark & Document;

@Schema({ timestamps: true })
export class PostBookmark {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'CommunityPost', required: true, index: true })
  postId: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;
}

export const PostBookmarkSchema = SchemaFactory.createForClass(PostBookmark);
PostBookmarkSchema.index({ postId: 1, userId: 1 }, { unique: true });

// Report Schema
export type PostReportDocument = PostReport & Document;

@Schema({ timestamps: true })
export class PostReport {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  reporterId: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'CommunityPost', required: true, index: true })
  postId: Types.ObjectId;

  @Prop({ required: true })
  reason: string;

  @Prop({ default: '' })
  description?: string;

  @Prop({ default: 'PENDING', enum: ['PENDING', 'RESOLVED', 'DISMISSED'] })
  status: string;
}

export const PostReportSchema = SchemaFactory.createForClass(PostReport);
