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
import { VideosService } from './videos.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles, Role } from '../common/decorators/roles.decorator';

@ApiTags('Care Videos')
@Controller('api/v1/videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách video hướng dẫn kỹ năng (Grooming, Cắt móng, Uống thuốc...)' })
  @ApiQuery({ name: 'category', required: false })
  async findAll(@Query('category') category?: string) {
    return this.videosService.findAll(category);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Xem chi tiết video' })
  async findById(@Param('id') id: string) {
    return this.videosService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Đăng video mới (Chỉ ADMIN)' })
  async create(@Body() dto: any) {
    return this.videosService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật video (Chỉ ADMIN)' })
  async update(@Param('id') id: string, @Body() dto: any) {
    return this.videosService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa video (Chỉ ADMIN)' })
  async delete(@Param('id') id: string) {
    return this.videosService.delete(id);
  }
}
