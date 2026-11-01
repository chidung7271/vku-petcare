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
import { RemindersService } from './reminders.service';
import { CreateReminderDto, UpdateReminderDto } from './dto/create-reminder.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Reminders')
@Controller('api/v1/reminders')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RemindersController {
  constructor(private readonly remindersService: RemindersService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo lịch nhắc hẹn mới (Vaccine, Thuốc, Tẩy giun, Grooming...)' })
  async create(
    @CurrentUser('_id') userId: string,
    @Body() dto: CreateReminderDto
  ) {
    return this.remindersService.create(userId.toString(), dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tất cả lịch nhắc hẹn của người dùng' })
  @ApiQuery({ name: 'petId', required: false })
  @ApiQuery({ name: 'status', required: false, enum: ['PENDING', 'COMPLETED'] })
  async findAll(
    @CurrentUser('_id') userId: string,
    @Query('petId') petId?: string,
    @Query('status') status?: string
  ) {
    return this.remindersService.findAll(userId.toString(), petId, status);
  }

  @Get('upcoming')
  @ApiOperation({ summary: 'Lấy danh sách lịch nhắc sắp đến hạn (?days=7)' })
  @ApiQuery({ name: 'days', required: false, example: 7 })
  async getUpcoming(
    @CurrentUser('_id') userId: string,
    @Query('days') days?: number
  ) {
    return this.remindersService.getUpcoming(userId.toString(), days ? Number(days) : 7);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật lịch nhắc hẹn' })
  async update(
    @Param('id') id: string,
    @CurrentUser('_id') userId: string,
    @Body() dto: UpdateReminderDto
  ) {
    return this.remindersService.update(id, userId.toString(), dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa lịch nhắc hẹn' })
  async delete(
    @Param('id') id: string,
    @CurrentUser('_id') userId: string
  ) {
    return this.remindersService.delete(id, userId.toString());
  }

  @Post(':id/complete')
  @ApiOperation({ summary: 'Đánh dấu hoàn thành nhắc nhở và tự động tạo lần lặp tiếp theo nếu có' })
  async complete(
    @Param('id') id: string,
    @CurrentUser('_id') userId: string
  ) {
    return this.remindersService.complete(id, userId.toString());
  }
}
