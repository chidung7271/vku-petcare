import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CommunityPost,
  CommunityPostSchema,
  Comment,
  CommentSchema,
  PostLike,
  PostLikeSchema,
  PostBookmark,
  PostBookmarkSchema,
  PostReport,
  PostReportSchema,
} from './schemas/community.schema';
import { CommunityService } from './community.service';
import { CommunityController } from './community.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CommunityPost.name, schema: CommunityPostSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: PostLike.name, schema: PostLikeSchema },
      { name: PostBookmark.name, schema: PostBookmarkSchema },
      { name: PostReport.name, schema: PostReportSchema },
    ]),
  ],
  controllers: [CommunityController],
  providers: [CommunityService],
  exports: [CommunityService],
})
export class CommunityModule {}
