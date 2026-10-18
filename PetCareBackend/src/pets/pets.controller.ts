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
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { PetsService } from './pets.service';
import { CreatePetDto, UpdatePetDto } from './dto/create-pet.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Pets')
@Controller('api/v1/pets')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @Post()
  @ApiOperation({ summary: 'Thêm hồ sơ thú cưng mới' })
  @ApiResponse({ status: 201, description: 'Tạo thú cưng thành công' })
  async create(
    @CurrentUser('_id') userId: string,
    @Body() dto: CreatePetDto
  ) {
    return this.petsService.create(userId.toString(), dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách thú cưng của người dùng hiện tại' })
  async findAll(@CurrentUser('_id') userId: string) {
    return this.petsService.findAllByOwner(userId.toString());
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết hồ sơ một thú cưng' })
  async findOne(
    @Param('id') id: string,
    @CurrentUser('_id') userId: string
  ) {
    return this.petsService.findOneByOwner(id, userId.toString());
  }

  @Get(':id/export')
  @ApiOperation({ summary: 'Xuất dữ liệu sổ y bạ và thông tin thú cưng (Export Health Card)' })
  async exportProfile(
    @Param('id') id: string,
    @CurrentUser('_id') userId: string
  ) {
    return this.petsService.exportHealthProfile(id, userId.toString());
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin hồ sơ thú cưng' })
  async update(
    @Param('id') id: string,
    @CurrentUser('_id') userId: string,
    @Body() dto: UpdatePetDto
  ) {
    return this.petsService.update(id, userId.toString(), dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa hồ sơ thú cưng' })
  async delete(
    @Param('id') id: string,
    @CurrentUser('_id') userId: string
  ) {
    return this.petsService.delete(id, userId.toString());
  }
}
