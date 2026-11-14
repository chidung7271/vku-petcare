import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { GrowthService } from './growth.service';
import { CreateWeightDto, CreatePhotoDto, CreateMilestoneDto } from './dto/create-growth.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Pet Growth & Timeline')
@Controller('api/v1/pets/:petId')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class GrowthController {
  constructor(private readonly growthService: GrowthService) {}

  @Post('milestone')
  @ApiOperation({ summary: 'Ghi nhận mốc phát triển & kỷ niệm (cân nặng, ảnh, ghi chú)' })
  async addMilestone(
    @Param('petId') petId: string,
    @CurrentUser('_id') userId: string,
    @Body() dto: CreateMilestoneDto
  ) {
    return this.growthService.addMilestone(petId, userId.toString(), dto);
  }

  @Post('weights')
  @ApiOperation({ summary: 'Ghi nhận cân nặng cho thú cưng' })
  async addWeight(
    @Param('petId') petId: string,
    @CurrentUser('_id') userId: string,
    @Body() dto: CreateWeightDto
  ) {
    return this.growthService.addWeight(petId, userId.toString(), dto);
  }

  @Get('weights')
  @ApiOperation({ summary: 'Lấy lịch sử cân nặng phục vụ vẽ biểu đồ' })
  async getWeights(
    @Param('petId') petId: string,
    @CurrentUser('_id') userId: string
  ) {
    return this.growthService.getWeights(petId, userId.toString());
  }

  @Post('photos')
  @ApiOperation({ summary: 'Thêm ảnh phát triển vào dòng thời gian' })
  async addPhoto(
    @Param('petId') petId: string,
    @CurrentUser('_id') userId: string,
    @Body() dto: CreatePhotoDto
  ) {
    return this.growthService.addPhoto(petId, userId.toString(), dto);
  }

  @Get('photos')
  @ApiOperation({ summary: 'Lấy danh sách ảnh phát triển (Before / After & Timeline)' })
  async getPhotos(
    @Param('petId') petId: string,
    @CurrentUser('_id') userId: string
  ) {
    return this.growthService.getPhotos(petId, userId.toString());
  }

  @Delete('photos/:photoId')
  @ApiOperation({ summary: 'Xóa ảnh phát triển' })
  async deletePhoto(
    @Param('petId') petId: string,
    @Param('photoId') photoId: string,
    @CurrentUser('_id') userId: string
  ) {
    return this.growthService.deletePhoto(petId, photoId, userId.toString());
  }
}
