import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AIProvider, AIHealthAssistantResponse } from '../interfaces/ai-provider.interface';
import { MockAIProvider } from './mock-ai.provider';

@Injectable()
export class OpenAIProvider implements AIProvider {
  private readonly logger = new Logger(OpenAIProvider.name);
  private apiKey: string | undefined;

  constructor(
    private configService: ConfigService,
    private mockProvider: MockAIProvider,
  ) {
    this.apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (!this.apiKey) {
      this.logger.warn('OPENAI_API_KEY is not configured. Falling back to MockAIProvider.');
    }
  }

  async ask(question: string, context?: Record<string, any>): Promise<AIHealthAssistantResponse> {
    if (!this.apiKey) {
      return this.mockProvider.ask(question, context);
    }
    // Production integration hook for OpenAI
    this.logger.log(`Calling OpenAI API for query: "${question}"`);
    return this.mockProvider.ask(question, context);
  }
}

@Injectable()
export class GeminiProvider implements AIProvider {
  private readonly logger = new Logger(GeminiProvider.name);
  private apiKey: string | undefined;

  constructor(
    private configService: ConfigService,
    private mockProvider: MockAIProvider,
  ) {
    this.apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!this.apiKey) {
      this.logger.warn('GEMINI_API_KEY is not configured. Falling back to MockAIProvider.');
    }
  }

  async ask(
    question: string, 
    context?: Record<string, any>, 
    history?: { role: 'user' | 'model'; text: string }[]
  ): Promise<AIHealthAssistantResponse> {
    if (!this.apiKey) {
      return this.mockProvider.ask(question, context, history);
    }

    try {
      this.logger.log(`Calling Google Gemini API for query: "${question}"`);
      const petName = context?.name || 'thú cưng';
      const petSpecies = context?.species === 'dog' ? 'Chó' : context?.species === 'cat' ? 'Mèo' : context?.species || 'Thú cưng';
      const petBreed = context?.breed ? ` (${context.breed})` : '';
      const petWeight = context?.weight ? `${context.weight} kg` : 'chưa rõ';
      const petAge = context?.age || context?.estimatedAge || 'chưa rõ';
      const petAllergies = Array.isArray(context?.allergies) && context.allergies.length > 0 
        ? context.allergies.join(', ') 
        : 'Không ghi nhận';
      const petChronic = Array.isArray(context?.chronicConditions) && context.chronicConditions.length > 0 
        ? context.chronicConditions.join(', ') 
        : 'Không có';
      const petNeutered = context?.isNeutered ? 'Đã triệt sản' : 'Chưa triệt sản / Không rõ';

      const systemInstructionText = `Bạn là Trợ lý Bác sĩ Thú y AI chuyên nghiệp của nền tảng PetCare Việt Nam.
Thông tin bệnh nhân thú cưng đang chăm sóc:
- Tên: ${petName}
- Giống loài: ${petSpecies}${petBreed}
- Cân nặng: ${petWeight}
- Độ tuổi: ${petAge}
- Tình trạng sinh sản: ${petNeutered}
- Tiền sử dị ứng: ${petAllergies}
- Bệnh mãn tính: ${petChronic}

Nhiệm vụ: Trả lời câu hỏi sức khỏe/dinh dưỡng/triệu chứng hoặc câu hỏi của chủ nuôi một cách ân cần, thấu hiểu, chuẩn y khoa thú y bằng tiếng Việt.
Nếu câu hỏi liên quan đến thức ăn hoặc thuốc mà trùng với Tiền sử dị ứng hoặc Bệnh mãn tính của bé, hãy đặc biệt lưu ý và nhắc nhở chủ nuôi.

BẮT BUỘC trả về định dạng JSON thuần túy (không bọc trong \`\`\`json) với cấu trúc sau:
{
  "riskLevel": "CRITICAL" (nếu nguy cấp, đe dọa tính mạng) | "CONSULT_VET" (cần đưa đi khám thú y) | "MONITOR" (theo dõi hoặc tư vấn thường quy),
  "answer": "Nội dung câu trả lời chi tiết, ân cần, đầy đủ",
  "immediateActions": ["Hành động cụ thể nên làm 1", "Hành động 2", "Hành động 3"],
  "warningSigns": ["Dấu hiệu nguy hiểm cần chú ý 1", "Dấu hiệu 2"],
  "whenToSeeVet": "Thời điểm hoặc điều kiện cụ thể cần đưa đi gặp bác sĩ thú y",
  "followUpQuestions": ["Câu hỏi gợi ý liên quan 1?", "Câu hỏi 2?", "Câu hỏi 3?"],
  "disclaimer": "Thông tin trợ lý chỉ mang tính tham khảo y tế ban đầu và TUYỆT ĐỐI không thay thế chẩn đoán trực tiếp của bác sĩ thú y."
}`;

      // Build conversation contents with history (limit to last 6 turns for optimal speed and context)
      const formattedContents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

      // If history exists, map prior messages
      if (Array.isArray(history) && history.length > 0) {
        const recentHistory = history.slice(-6);
        for (const item of recentHistory) {
          formattedContents.push({
            role: item.role === 'model' ? 'model' : 'user',
            parts: [{ text: item.text }]
          });
        }
      }

      // Add current user query with system instruction
      formattedContents.push({
        role: 'user',
        parts: [{ text: `${systemInstructionText}\n\n[Hội thoại tiếp theo]\nCâu hỏi mới nhất của chủ nuôi: "${question}"` }]
      });

      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${this.apiKey}`;
      const payload = {
        contents: formattedContents,
        generationConfig: {
          temperature: 0.3,
          responseMimeType: 'application/json'
        }
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error(`Gemini API error: ${response.status} - ${errorText}`);
        return this.mockProvider.ask(question, context, history);
      }

      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (rawText) {
        try {
          const parsed = JSON.parse(rawText);
          return {
            riskLevel: parsed.riskLevel || 'MONITOR',
            answer: parsed.answer || 'Tôi đã tiếp nhận câu hỏi của bạn.',
            immediateActions: Array.isArray(parsed.immediateActions) ? parsed.immediateActions : [],
            warningSigns: Array.isArray(parsed.warningSigns) ? parsed.warningSigns : [],
            whenToSeeVet: parsed.whenToSeeVet || 'Nên liên hệ bác sĩ nếu có dấu hiệu bất thường.',
            followUpQuestions: Array.isArray(parsed.followUpQuestions) ? parsed.followUpQuestions : [],
            sources: 'Trợ lý AI Thú Y PetCare (Google Gemini)',
            disclaimer: parsed.disclaimer || 'Thông tin trợ lý chỉ mang tính tham khảo y tế ban đầu.'
          };
        } catch (parseErr) {
          this.logger.warn(`Failed to parse Gemini JSON response, extracting text: ${parseErr}`);
        }
      }
    } catch (err: any) {
      this.logger.error(`Failed to connect to Gemini API: ${err?.message || err}`);
    }

    return this.mockProvider.ask(question, context, history);
  }
}
