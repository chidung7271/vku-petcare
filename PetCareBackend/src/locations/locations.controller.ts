import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  UseGuards
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LocationsService } from './locations.service';
import { QueryNearbyLocationsDto } from './dto/query-location.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Veterinary Locations & Pet Stores')
@Controller('api/v1/locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Get('nearby')
  @ApiOperation({ summary: 'Tìm bệnh viện 24/7, phòng khám, cửa hàng gần nhất theo tọa độ GPS' })
  async findNearby(@Query() query: QueryNearbyLocationsDto) {
    return this.locationsService.findNearby(query);
  }

  @Get('favorites')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy danh sách cơ sở/bác sĩ quen đã lưu yêu thích của user' })
  async getFavorites(@CurrentUser('_id') userId: string) {
    return this.locationsService.getFavorites(userId.toString());
  }

  @Get(':id')
  @ApiOperation({ summary: 'Xem chi tiết một cơ sở thú y' })
  async findById(@Param('id') id: string) {
    return this.locationsService.findById(id);
  }

  @Post(':locationId/favorite')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lưu một cơ sở thú y vào danh sách yêu thích' })
  async addFavorite(
    @Param('locationId') locationId: string,
    @CurrentUser('_id') userId: string
  ) {
    return this.locationsService.addFavorite(userId.toString(), locationId);
  }

  @Delete(':locationId/favorite')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa cơ sở thú y khỏi danh sách yêu thích' })
  async removeFavorite(
    @Param('locationId') locationId: string,
    @CurrentUser('_id') userId: string
  ) {
    return this.locationsService.removeFavorite(userId.toString(), locationId);
  }
}
