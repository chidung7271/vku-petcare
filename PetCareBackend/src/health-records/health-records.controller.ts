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
import { HealthRecordsService } from './health-records.service';
import { CreateHealthRecordDto, UpdateHealthRecordDto } from './dto/create-health-record.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Electronic Health Records')
@Controller('api/v1/pets/:petId/health-records')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class HealthRecordsController {
  constructor(private readonly healthRecordsService: HealthRecordsService) {}

  @Post()
  @ApiOperation({ summary: 'Thêm bản ghi sổ sức khỏe điện tử mới' })
  async create(
    @Param('petId') petId: string,
    @CurrentUser('_id') userId: string,
    @Body() dto: CreateHealthRecordDto
  ) {
    return this.healthRecordsService.create(petId, userId.toString(), dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy toàn bộ hồ sơ y bạ của thú cưng (có lọc theo phân loại)' })
  @ApiQuery({ name: 'type', required: false, description: 'VACCINE, CHECKUP, DEWORMING, MEDICATION...' })
  async findAll(
    @Param('petId') petId: string,
    @CurrentUser('_id') userId: string,
    @Query('type') type?: string
  ) {
    return this.healthRecordsService.findAllByPet(petId, userId.toString(), type);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Xem chi tiết một bản ghi y tế' })
  async findOne(
    @Param('petId') petId: string,
    @Param('id') id: string,
    @CurrentUser('_id') userId: string
  ) {
    return this.healthRecordsService.findOne(petId, id, userId.toString());
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật bản ghi y tế' })
  async update(
    @Param('petId') petId: string,
    @Param('id') id: string,
    @CurrentUser('_id') userId: string,
    @Body() dto: UpdateHealthRecordDto
  ) {
    return this.healthRecordsService.update(petId, id, userId.toString(), dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa bản ghi y tế' })
  async delete(
    @Param('petId') petId: string,
    @Param('id') id: string,
    @CurrentUser('_id') userId: string
  ) {
    return this.healthRecordsService.delete(petId, id, userId.toString());
  }
}
