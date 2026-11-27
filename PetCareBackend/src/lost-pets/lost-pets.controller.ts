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
import { LostPetsService } from './lost-pets.service';
import { CreateLostPetDto, UpdateLostPetDto } from './dto/lost-pet.dto';
import { JwtAuthGuard, OptionalJwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Lost & Found Pets')
@Controller('api/v1/lost-pets')
export class LostPetsController {
  constructor(private readonly lostPetsService: LostPetsService) {}

  @Post()
  @UseGuards(OptionalJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Đăng tin tìm thú cưng thất lạc hoặc thông báo nhặt được pet' })
  async create(
    @CurrentUser('_id') userId: string | undefined,
    @Body() dto: CreateLostPetDto
  ) {
    return this.lostPetsService.create(userId ? userId.toString() : undefined, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách thú cưng thất lạc (Public)' })
  @ApiQuery({ name: 'status', required: false, enum: ['LOST', 'FOUND', 'REUNITED', 'CLOSED'] })
  @ApiQuery({ name: 'search', required: false })
  async findAll(
    @Query('status') status?: string,
    @Query('search') search?: string
  ) {
    return this.lostPetsService.findAll(status, search);
  }

  @Get(':id/poster-data')
  @ApiOperation({ summary: 'Lấy dữ liệu để xuất áp phích (poster) in ấn kèm mã QR chia sẻ (Public)' })
  async getPosterData(@Param('id') id: string) {
    return this.lostPetsService.getPosterData(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Xem chi tiết tin báo thất lạc (Public)' })
  async findById(@Param('id') id: string) {
    return this.lostPetsService.findById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Chỉnh sửa tin báo (Chỉ chủ tin báo)' })
  async update(
    @Param('id') id: string,
    @CurrentUser('_id') userId: string,
    @Body() dto: UpdateLostPetDto
  ) {
    return this.lostPetsService.update(id, userId.toString(), dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa tin báo (Chỉ chủ tin báo)' })
  async delete(
    @Param('id') id: string,
    @CurrentUser('_id') userId: string
  ) {
    return this.lostPetsService.delete(id, userId.toString());
  }

  @Post(':id/found')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Đánh dấu thú cưng đã được tìm thấy' })
  async markFound(
    @Param('id') id: string,
    @CurrentUser('_id') userId: string
  ) {
    return this.lostPetsService.markFound(id, userId.toString());
  }
}
