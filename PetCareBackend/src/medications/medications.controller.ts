import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MedicationsService } from './medications.service';
import { CreateMedicationDto, UpdateMedicationDto } from './dto/create-medication.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Medications')
@Controller('api/v1/pets/:petId/medications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MedicationsController {
  constructor(private readonly medicationsService: MedicationsService) {}

  @Post()
  @ApiOperation({ summary: 'Thêm đơn thuốc / thuốc đang sử dụng cho thú cưng' })
  async create(
    @Param('petId') petId: string,
    @CurrentUser('_id') userId: string,
    @Body() dto: CreateMedicationDto
  ) {
    return this.medicationsService.create(petId, userId.toString(), dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách thuốc của thú cưng' })
  async findAll(
    @Param('petId') petId: string,
    @CurrentUser('_id') userId: string
  ) {
    return this.medicationsService.findAllByPet(petId, userId.toString());
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật đơn thuốc' })
  async update(
    @Param('petId') petId: string,
    @Param('id') id: string,
    @CurrentUser('_id') userId: string,
    @Body() dto: UpdateMedicationDto
  ) {
    return this.medicationsService.update(petId, id, userId.toString(), dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa đơn thuốc' })
  async delete(
    @Param('petId') petId: string,
    @Param('id') id: string,
    @CurrentUser('_id') userId: string
  ) {
    return this.medicationsService.delete(petId, id, userId.toString());
  }
}
