import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { EmergencyService } from './emergency.service';
import { TriageRequestDto, CreateEmergencyCaseDto } from './dto/triage-request.dto';

@ApiTags('Emergency SOS & Triage')
@Controller('api/v1/emergency')
export class EmergencyController {
  constructor(private readonly emergencyService: EmergencyService) {}

  @Post('triage')
  @ApiOperation({ summary: 'Emergency Triage: Phân loại rủi ro & trả checklist hành động khẩn cấp tức thì' })
  @ApiResponse({ status: 200, description: 'Phân loại mức độ khẩn cấp, việc cần làm ngay, điều cấm làm' })
  async triage(@Body() dto: TriageRequestDto) {
    return this.emergencyService.triage(dto);
  }

  @Get('guides')
  @ApiOperation({ summary: 'Lấy toàn bộ hướng dẫn sơ cứu khẩn cấp (Ngộ độc, Hóc, Co giật, Sốc nhiệt...)' })
  async getGuides() {
    return this.emergencyService.getGuides();
  }

  @Get('guides/:slug')
  @ApiOperation({ summary: 'Chi tiết hướng dẫn sơ cứu theo chuyên đề' })
  async getGuideBySlug(@Param('slug') slug: string) {
    return this.emergencyService.getGuideBySlug(slug);
  }

  @Post('cases')
  @ApiOperation({ summary: 'Tạo tình huống cấp cứu mẫu (Admin/System)' })
  async createCase(@Body() dto: CreateEmergencyCaseDto) {
    return this.emergencyService.createCase(dto);
  }
}
