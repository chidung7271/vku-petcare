import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AIService } from './ai.service';
import { AIController } from './ai.controller';
import { MockAIProvider } from './providers/mock-ai.provider';
import { OpenAIProvider, GeminiProvider } from './providers/external-ai.providers';
import { EmergencyModule } from '../emergency/emergency.module';

@Module({
  imports: [ConfigModule, EmergencyModule],
  controllers: [AIController],
  providers: [AIService, MockAIProvider, OpenAIProvider, GeminiProvider],
  exports: [AIService],
})
export class AIModule {}
