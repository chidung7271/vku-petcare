import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AIService, AIQueryDto } from './ai.service';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AskAIHealthDto implements AIQueryDto {
  @ApiPropertyOptional({ example: 'pet_milo' })
  @IsOptional()
  @IsString()
  petId?: string;

  @ApiProperty({ example: 'Mèo không chịu ăn 2 ngày có sao không?' })
  @IsString()
  @IsNotEmpty({ message: 'Câu hỏi không được để trống' })
  question: string;

  @ApiPropertyOptional({ example: { name: 'Milo', species: 'dog', weight: 28.5 } })
  @IsOptional()
  context?: Record<string, any>;

  @ApiPropertyOptional({ example: [{ role: 'user', text: 'Chó tôi bị nôn' }] })
  @IsOptional()
  history?: { role: 'user' | 'model'; text: string }[];
}

@ApiTags('AI Pet Health Assistant')
@Controller('api/v1/ai')
export class AIController {
  constructor(private readonly aiService: AIService) {}

  @Post('health-assistant')
  @ApiOperation({ summary: 'Hỏi đáp triệu chứng & dinh dưỡng thú cưng với AI Health Assistant' })
  @ApiResponse({ status: 200, description: 'Trả về phân loại mức độ nguy hiểm, hành động nên làm, dấu hiệu cảnh báo' })
  async askHealthAssistant(@Body() dto: AskAIHealthDto) {
    return this.aiService.askHealthAssistant(dto);
  }
}
