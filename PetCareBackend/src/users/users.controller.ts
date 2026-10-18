import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  UseGuards
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Users')
@Controller('api/v1/users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Lấy thông tin profile người dùng hiện tại' })
  async getProfile(@CurrentUser('_id') userId: string) {
    return this.usersService.findById(userId.toString());
  }

  @Patch('me')
  @ApiOperation({ summary: 'Cập nhật profile, theme, thông báo, liên hệ khẩn cấp' })
  async updateProfile(
    @CurrentUser('_id') userId: string,
    @Body() dto: UpdateUserDto
  ) {
    return this.usersService.updateProfile(userId.toString(), dto);
  }

  @Delete('me')
  @ApiOperation({ summary: 'Xóa tài khoản người dùng an toàn' })
  async deleteAccount(@CurrentUser('_id') userId: string) {
    return this.usersService.deleteAccount(userId.toString());
  }
}
