import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('health')
@Controller()
export class AppController {
  @Get('health')
  @ApiOperation({ summary: 'Kiểm tra trạng thái hệ thống PetCare API' })
  healthCheck() {
    return {
      status: 'ok',
      service: 'PetCare Assistant API',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}
