import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AIProvider, AIHealthAssistantResponse } from './interfaces/ai-provider.interface';
import { MockAIProvider } from './providers/mock-ai.provider';
import { OpenAIProvider, GeminiProvider } from './providers/external-ai.providers';
import { EmergencySafetyService } from '../emergency/emergency-safety.service';

export interface ChatHistoryItem {
  role: 'user' | 'model';
  text: string;
}

export interface AIQueryDto {
  petId?: string;
  question: string;
  context?: Record<string, any>;
  history?: ChatHistoryItem[];
}

@Injectable()
export class AIService {
  private readonly logger = new Logger(AIService.name);
  private selectedProvider: AIProvider;

  constructor(
    private configService: ConfigService,
    private mockProvider: MockAIProvider,
    private openAIProvider: OpenAIProvider,
    private geminiProvider: GeminiProvider,
    private emergencySafetyService: EmergencySafetyService,
  ) {
    const providerName = this.configService.get<string>('AI_PROVIDER', 'mock').toLowerCase();
    if (providerName === 'openai') {
      this.selectedProvider = this.openAIProvider;
    } else if (providerName === 'gemini') {
      this.selectedProvider = this.geminiProvider;
    } else {
      this.selectedProvider = this.mockProvider;
    }
    this.logger.log(`Active AI Provider: ${providerName.toUpperCase()}`);
  }

  async askHealthAssistant(dto: AIQueryDto): Promise<AIHealthAssistantResponse> {
    // 1. Critical Emergency Safety Filter
    if (this.emergencySafetyService.isCriticalEmergency(dto.question)) {
      this.logger.warn(`Emergency keywords detected in AI query! Escalating to Emergency Triage.`);
      const triage = this.emergencySafetyService.evaluateTriage({
        petId: dto.petId,
        problem: dto.question,
      });

      return {
        riskLevel: triage.severity === 'CRITICAL' ? 'CRITICAL' : 'CONSULT_VET',
        answer: `CẢNH BÁO KHẨN CẤP: Câu hỏi của bạn chứa các dấu hiệu nguy kịch (${triage.title}). Xin vui lòng liên hệ cơ sở y tế thú y hoặc cấp cứu ngay lập tức.`,
        immediateActions: triage.immediateActions,
        warningSigns: triage.redFlags,
        whenToSeeVet: 'Đến cơ sở thú y gần nhất ngay trong thời gian vàng.',
        followUpQuestions: triage.recommendedQuestions,
        sources: 'Quy chuẩn An toàn Cấp cứu Thú y Quốc tế',
        disclaimer: triage.disclaimer,
      };
    }

    // 2. Query Selected AI Provider
    return this.selectedProvider.ask(dto.question, dto.context, dto.history);
  }
}
