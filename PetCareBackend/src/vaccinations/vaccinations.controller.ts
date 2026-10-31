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
import { VaccinationsService } from './vaccinations.service';
import { CreateVaccinationDto, UpdateVaccinationDto } from './dto/create-vaccination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Vaccinations')
@Controller('api/v1')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class VaccinationsController {
  constructor(private readonly vaccinationsService: VaccinationsService) {}

  @Get('vaccinations/upcoming')
  @ApiOperation({ summary: 'Lấy danh sách các mũi tiêm sắp đến hạn của user (?days=30)' })
  @ApiQuery({ name: 'days', required: false, example: 30 })
  async getUpcoming(
    @CurrentUser('_id') userId: string,
    @Query('days') days?: number
  ) {
    return this.vaccinationsService.getUpcoming(userId.toString(), days ? Number(days) : 30);
  }

  @Post('pets/:petId/vaccinations')
  @ApiOperation({ summary: 'Thêm bản ghi tiêm phòng vaccine cho thú cưng' })
  async create(
    @Param('petId') petId: string,
    @CurrentUser('_id') userId: string,
    @Body() dto: CreateVaccinationDto
  ) {
    return this.vaccinationsService.create(petId, userId.toString(), dto);
  }

  @Get('pets/:petId/vaccinations')
  @ApiOperation({ summary: 'Lấy lịch sử tiêm phòng vaccine của thú cưng' })
  async findAllByPet(
    @Param('petId') petId: string,
    @CurrentUser('_id') userId: string
  ) {
    return this.vaccinationsService.findAllByPet(petId, userId.toString());
  }

  @Patch('pets/:petId/vaccinations/:id')
  @ApiOperation({ summary: 'Cập nhật bản ghi vaccine' })
  async update(
    @Param('petId') petId: string,
    @Param('id') id: string,
    @CurrentUser('_id') userId: string,
    @Body() dto: UpdateVaccinationDto
  ) {
    return this.vaccinationsService.update(petId, id, userId.toString(), dto);
  }

  @Delete('pets/:petId/vaccinations/:id')
  @ApiOperation({ summary: 'Xóa bản ghi vaccine' })
  async delete(
    @Param('petId') petId: string,
    @Param('id') id: string,
    @CurrentUser('_id') userId: string
  ) {
    return this.vaccinationsService.delete(petId, id, userId.toString());
  }
}
