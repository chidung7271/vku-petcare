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
import { KnowledgeService } from './knowledge.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles, Role } from '../common/decorators/roles.decorator';

@ApiTags('Knowledge Base')
@Controller('api/v1/knowledge')
export class KnowledgeController {
  constructor(private readonly knowledgeService: KnowledgeService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách bài viết kiến thức y khoa có phân trang & tìm kiếm' })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  async findAll(
    @Query('category') category?: string,
    @Query('search') search?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number
  ) {
    return this.knowledgeService.findAll(category, search, page ? Number(page) : 1, limit ? Number(limit) : 20);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Xem chi tiết bài viết kiến thức theo slug' })
  async findBySlug(@Param('slug') slug: string) {
    return this.knowledgeService.findBySlug(slug);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo bài viết mới (Chỉ ADMIN)' })
  async create(@Body() dto: any) {
    return this.knowledgeService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Chỉnh sửa bài viết (Chỉ ADMIN)' })
  async update(@Param('id') id: string, @Body() dto: any) {
    return this.knowledgeService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa bài viết (Chỉ ADMIN)' })
  async delete(@Param('id') id: string) {
    return this.knowledgeService.delete(id);
  }
}
