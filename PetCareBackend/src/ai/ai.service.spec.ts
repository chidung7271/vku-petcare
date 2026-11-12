import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { AIService } from './ai.service';
import { MockAIProvider } from './providers/mock-ai.provider';
import { OpenAIProvider, GeminiProvider } from './providers/external-ai.providers';
import { EmergencySafetyService } from '../emergency/emergency-safety.service';

describe('AIService', () => {
  let service: AIService;
  let emergencySafetyService: EmergencySafetyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AIService,
        MockAIProvider,
        OpenAIProvider,
        GeminiProvider,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string, defaultValue?: string) => {
              if (key === 'AI_PROVIDER') return 'mock';
              return defaultValue;
            }),
          },
        },
        EmergencySafetyService,
      ],
    }).compile();

    service = module.get<AIService>(AIService);
    emergencySafetyService = module.get<EmergencySafetyService>(EmergencySafetyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should intercept toxic emergency query and escalate with safety guardrail', async () => {
    const result = await service.askHealthAssistant({
      question: 'Chó lỡ ăn phải bả chuột thì xử lý thế nào?',
    });

    expect(result.riskLevel).toBe('CRITICAL');
    expect(result.answer).toContain('CẢNH BÁO KHẨN CẤP');
    expect(result.immediateActions.length).toBeGreaterThan(0);
  });

  it('should answer general pet care and nutrition questions safely', async () => {
    const result = await service.askHealthAssistant({
      question: 'Mèo con 2 tháng tuổi nên ăn loại thức ăn nào?',
      context: { name: 'Miu', species: 'cat' },
    });

    expect(result).toBeDefined();
    expect(result.answer).toBeDefined();
    expect(result.disclaimer).toBeDefined();
  });
});
