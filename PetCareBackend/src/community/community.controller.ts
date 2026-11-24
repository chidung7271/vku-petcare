import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CommunityService } from './community.service';
import { CreatePostDto, CreateCommentDto, ReportPostDto } from './dto/community.dto';
import { JwtAuthGuard, OptionalJwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Community')
@Controller('api/v1/community')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  @Get('posts')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Lấy danh sách bài viết cộng đồng (có phân trang, định dạng video/bài viết & tìm kiếm)' })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'postType', required: false, enum: ['article', 'video', 'tip', 'qa', 'all'] })
  @ApiQuery({ name: 'verifiedOnly', required: false, type: Boolean })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  async findAllPosts(
    @Query('category') category?: string,
    @Query('postType') postType?: string,
    @Query('verifiedOnly') verifiedOnly?: string,
    @Query('search') search?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @CurrentUser('_id') userId?: string
  ) {
    return this.communityService.findAllPosts(
      category,
      search,
      page ? Number(page) : 1,
      limit ? Number(limit) : 20,
      userId ? userId.toString() : undefined,
      postType,
      verifiedOnly === 'true'
    );
  }

  @Get('posts/:id')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Xem chi tiết bài viết' })
  async findPostById(@Param('id') id: string, @CurrentUser('_id') userId?: string) {
    return this.communityService.findPostById(id, userId ? userId.toString() : undefined);
  }

  @Post('posts')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Đăng bài viết mới lên cộng đồng' })
  async createPost(@CurrentUser('_id') userId: string, @Body() dto: CreatePostDto) {
    return this.communityService.createPost(userId.toString(), dto);
  }

  @Patch('posts/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Sửa bài viết (Chỉ tác giả)' })
  async updatePost(
    @Param('id') id: string,
    @CurrentUser('_id') userId: string,
    @Body() dto: any
  ) {
    return this.communityService.updatePost(id, userId.toString(), dto);
  }

  @Delete('posts/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa bài viết (Tác giả hoặc ADMIN)' })
  async deletePost(@Param('id') id: string, @CurrentUser() user: any) {
    return this.communityService.deletePost(id, user._id.toString(), user.role === 'ADMIN');
  }

  // Comments
  @Get('posts/:id/comments')
  @ApiOperation({ summary: 'Lấy bình luận của bài viết' })
  async getComments(@Param('id') postId: string) {
    return this.communityService.getComments(postId);
  }

  @Post('posts/:id/comments')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Bình luận vào bài viết' })
  async addComment(
    @Param('id') postId: string,
    @CurrentUser('_id') userId: string,
    @Body() dto: CreateCommentDto
  ) {
    return this.communityService.addComment(postId, userId.toString(), dto);
  }

  @Delete('comments/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa bình luận' })
  async deleteComment(@Param('id') id: string, @CurrentUser('_id') userId: string) {
    return this.communityService.deleteComment(id, userId.toString());
  }

  // Likes
  @Post('posts/:id/like')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Thả tim (Like) bài viết' })
  async likePost(@Param('id') id: string, @CurrentUser('_id') userId: string) {
    return this.communityService.likePost(id, userId.toString());
  }

  @Delete('posts/:id/like')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Bỏ thả tim bài viết' })
  async unlikePost(@Param('id') id: string, @CurrentUser('_id') userId: string) {
    return this.communityService.unlikePost(id, userId.toString());
  }

  // Bookmarks
  @Post('posts/:id/bookmark')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lưu bài viết vào danh sách quan tâm' })
  async bookmarkPost(@Param('id') id: string, @CurrentUser('_id') userId: string) {
    return this.communityService.bookmarkPost(id, userId.toString());
  }

  @Delete('posts/:id/bookmark')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Bỏ lưu bài viết' })
  async unbookmarkPost(@Param('id') id: string, @CurrentUser('_id') userId: string) {
    return this.communityService.unbookmarkPost(id, userId.toString());
  }

  @Get('bookmarks')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy danh sách các bài viết đã bookmark của user' })
  async getBookmarks(@CurrentUser('_id') userId: string) {
    return this.communityService.getBookmarks(userId.toString());
  }

  // Report
  @Post('posts/:id/report')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Báo cáo vi phạm nội dung bài viết' })
  async reportPost(
    @Param('id') postId: string,
    @CurrentUser('_id') userId: string,
    @Body() dto: ReportPostDto
  ) {
    return this.communityService.reportPost(postId, userId.toString(), dto);
  }
}
