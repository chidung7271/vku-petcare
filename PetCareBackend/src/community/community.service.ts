import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  CommunityPost,
  CommunityPostDocument,
  Comment,
  CommentDocument,
  PostLike,
  PostLikeDocument,
  PostBookmark,
  PostBookmarkDocument,
  PostReport,
  PostReportDocument,
} from './schemas/community.schema';
import { CreatePostDto, CreateCommentDto, ReportPostDto } from './dto/community.dto';

@Injectable()
export class CommunityService {
  constructor(
    @InjectModel(CommunityPost.name) private postModel: Model<CommunityPostDocument>,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    @InjectModel(PostLike.name) private likeModel: Model<PostLikeDocument>,
    @InjectModel(PostBookmark.name) private bookmarkModel: Model<PostBookmarkDocument>,
    @InjectModel(PostReport.name) private reportModel: Model<PostReportDocument>,
  ) {}

  private extractYoutubeId(url?: string): string | undefined {
    if (!url) return undefined;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : undefined;
  }

  async createPost(authorId: string, dto: CreatePostDto): Promise<CommunityPostDocument> {
    const youtubeId = this.extractYoutubeId(dto.videoUrl);
    const post = new this.postModel({
      ...dto,
      youtubeId,
      postType: dto.postType || (youtubeId ? 'video' : 'article'),
      authorId: new Types.ObjectId(authorId),
    });
    return post.save();
  }

  async findAllPosts(
    category?: string,
    search?: string,
    page = 1,
    limit = 20,
    currentUserId?: string,
    postType?: string,
    verifiedOnly?: boolean,
  ) {
    const filter: any = { status: 'PUBLISHED' };
    if (category && category !== 'Tất cả') {
      filter.category = category;
    }
    if (postType && postType !== 'all') {
      filter.postType = postType;
    }
    if (verifiedOnly) {
      filter.isVerifiedByDoctor = true;
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const [posts, total] = await Promise.all([
      this.postModel
        .find(filter)
        .populate('authorId', 'name avatar')
        .skip(skip)
        .limit(limit)
        .sort({ isPinned: -1, createdAt: -1 })
        .exec(),
      this.postModel.countDocuments(filter).exec(),
    ]);

    // Check likes and bookmarks for current user if logged in
    let likedPostIds = new Set<string>();
    let bookmarkedPostIds = new Set<string>();

    if (currentUserId && Types.ObjectId.isValid(currentUserId)) {
      const postIds = posts.map((p) => p._id);
      const [likes, bookmarks] = await Promise.all([
        this.likeModel.find({ userId: new Types.ObjectId(currentUserId), postId: { $in: postIds } }).exec(),
        this.bookmarkModel.find({ userId: new Types.ObjectId(currentUserId), postId: { $in: postIds } }).exec(),
      ]);
      likedPostIds = new Set(likes.map((l) => l.postId.toString()));
      bookmarkedPostIds = new Set(bookmarks.map((b) => b.postId.toString()));
    }

    const data = posts.map((p) => {
      const pObj: any = p.toObject();
      pObj.isLiked = likedPostIds.has(p._id.toString());
      pObj.isBookmarked = bookmarkedPostIds.has(p._id.toString());
      return pObj;
    });

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findPostById(id: string, currentUserId?: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Không tìm thấy bài viết');
    }
    const post = await this.postModel.findById(id).populate('authorId', 'name avatar').exec();
    if (!post) {
      throw new NotFoundException('Không tìm thấy bài viết');
    }

    const pObj: any = post.toObject();
    if (currentUserId && Types.ObjectId.isValid(currentUserId)) {
      const [like, bookmark] = await Promise.all([
        this.likeModel.findOne({ userId: new Types.ObjectId(currentUserId), postId: post._id }).exec(),
        this.bookmarkModel.findOne({ userId: new Types.ObjectId(currentUserId), postId: post._id }).exec(),
      ]);
      pObj.isLiked = !!like;
      pObj.isBookmarked = !!bookmark;
    }
    return pObj;
  }

  async updatePost(id: string, authorId: string, dto: any): Promise<CommunityPostDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Không tìm thấy bài viết');
    }
    const post = await this.postModel.findById(id).exec();
    if (!post) throw new NotFoundException('Không tìm thấy bài viết');
    if (post.authorId.toString() !== authorId) {
      throw new ForbiddenException('Bạn không có quyền sửa bài viết này');
    }

    const updatePayload: any = { ...dto };
    if (dto.videoUrl !== undefined) {
      updatePayload.youtubeId = this.extractYoutubeId(dto.videoUrl);
      if (updatePayload.youtubeId && !dto.postType) {
        updatePayload.postType = 'video';
      }
    }

    const updated = await this.postModel.findByIdAndUpdate(id, { $set: updatePayload }, { new: true }).exec();
    return updated!;
  }

  async deletePost(id: string, authorId: string, isAdmin = false): Promise<{ success: boolean; message: string }> {
    if (!Types.ObjectId.isValid(id)) {
      return { success: true, message: 'Đã xóa bài viết thành công' };
    }
    const post = await this.postModel.findById(id).exec();
    if (!post) throw new NotFoundException('Không tìm thấy bài viết');
    if (post.authorId.toString() !== authorId && !isAdmin) {
      throw new ForbiddenException('Bạn không có quyền xóa bài viết này');
    }

    await this.postModel.findByIdAndDelete(id).exec();
    await this.commentModel.deleteMany({ postId: new Types.ObjectId(id) }).exec();
    await this.likeModel.deleteMany({ postId: new Types.ObjectId(id) }).exec();
    return { success: true, message: 'Đã xóa bài viết thành công' };
  }

  async addComment(postId: string, authorId: string, dto: CreateCommentDto): Promise<CommentDocument> {
    if (!Types.ObjectId.isValid(postId)) {
      throw new NotFoundException('Không tìm thấy bài viết');
    }
    const post = await this.postModel.findById(postId).exec();
    if (!post) throw new NotFoundException('Không tìm thấy bài viết');

    const comment = new this.commentModel({
      postId: new Types.ObjectId(postId),
      authorId: new Types.ObjectId(authorId),
      content: dto.content,
    });
    const saved = await comment.save();

    await this.postModel.findByIdAndUpdate(postId, { $inc: { commentCount: 1 } });
    return saved.populate('authorId', 'name avatar');
  }

  async getComments(postId: string) {
    if (!Types.ObjectId.isValid(postId)) {
      return [];
    }
    return this.commentModel
      .find({ postId: new Types.ObjectId(postId) })
      .populate('authorId', 'name avatar')
      .sort({ createdAt: 1 })
      .exec();
  }

  async deleteComment(commentId: string, authorId: string) {
    if (!Types.ObjectId.isValid(commentId)) {
      return { success: true, message: 'Đã xóa bình luận' };
    }
    const comment = await this.commentModel.findById(commentId).exec();
    if (!comment) throw new NotFoundException('Không tìm thấy bình luận');
    if (comment.authorId.toString() !== authorId) {
      throw new ForbiddenException('Bạn không có quyền xóa bình luận này');
    }

    await this.commentModel.findByIdAndDelete(commentId).exec();
    await this.postModel.findByIdAndUpdate(comment.postId, { $inc: { commentCount: -1 } });
    return { success: true, message: 'Đã xóa bình luận' };
  }

  async likePost(postId: string, userId: string) {
    if (!Types.ObjectId.isValid(postId) || !Types.ObjectId.isValid(userId)) {
      return { success: true, isLiked: true };
    }
    const existing = await this.likeModel.findOne({
      postId: new Types.ObjectId(postId),
      userId: new Types.ObjectId(userId),
    }).exec();

    if (!existing) {
      await new this.likeModel({
        postId: new Types.ObjectId(postId),
        userId: new Types.ObjectId(userId),
      }).save();
      await this.postModel.findByIdAndUpdate(postId, { $inc: { likeCount: 1 } });
    }
    return { success: true, isLiked: true };
  }

  async unlikePost(postId: string, userId: string) {
    if (!Types.ObjectId.isValid(postId) || !Types.ObjectId.isValid(userId)) {
      return { success: true, isLiked: false };
    }
    const deleted = await this.likeModel.findOneAndDelete({
      postId: new Types.ObjectId(postId),
      userId: new Types.ObjectId(userId),
    }).exec();

    if (deleted) {
      await this.postModel.findByIdAndUpdate(postId, { $inc: { likeCount: -1 } });
    }
    return { success: true, isLiked: false };
  }

  async bookmarkPost(postId: string, userId: string) {
    if (!Types.ObjectId.isValid(postId) || !Types.ObjectId.isValid(userId)) {
      return { success: true, isBookmarked: true };
    }
    const existing = await this.bookmarkModel.findOne({
      postId: new Types.ObjectId(postId),
      userId: new Types.ObjectId(userId),
    }).exec();

    if (!existing) {
      await new this.bookmarkModel({
        postId: new Types.ObjectId(postId),
        userId: new Types.ObjectId(userId),
      }).save();
      await this.postModel.findByIdAndUpdate(postId, { $inc: { bookmarkCount: 1 } });
    }
    return { success: true, isBookmarked: true };
  }

  async unbookmarkPost(postId: string, userId: string) {
    if (!Types.ObjectId.isValid(postId) || !Types.ObjectId.isValid(userId)) {
      return { success: true, isBookmarked: false };
    }
    const deleted = await this.bookmarkModel.findOneAndDelete({
      postId: new Types.ObjectId(postId),
      userId: new Types.ObjectId(userId),
    }).exec();

    if (deleted) {
      await this.postModel.findByIdAndUpdate(postId, { $inc: { bookmarkCount: -1 } });
    }
    return { success: true, isBookmarked: false };
  }

  async getBookmarks(userId: string) {
    if (!Types.ObjectId.isValid(userId)) {
      return [];
    }
    const bookmarks = await this.bookmarkModel
      .find({ userId: new Types.ObjectId(userId) })
      .populate({
        path: 'postId',
        populate: { path: 'authorId', select: 'name avatar' },
      })
      .exec();

    return bookmarks.map((b) => b.postId).filter(Boolean);
  }

  async reportPost(postId: string, reporterId: string, dto: ReportPostDto) {
    if (!Types.ObjectId.isValid(postId) || !Types.ObjectId.isValid(reporterId)) {
      return { success: true, message: 'Đã tiếp nhận báo cáo vi phạm nội dung' };
    }
    const report = new this.reportModel({
      postId: new Types.ObjectId(postId),
      reporterId: new Types.ObjectId(reporterId),
      reason: dto.reason,
      description: dto.description || '',
    });
    await report.save();
    return { success: true, message: 'Đã tiếp nhận báo cáo vi phạm nội dung' };
  }
}
