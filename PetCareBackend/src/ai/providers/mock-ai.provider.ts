import { Injectable, Logger } from '@nestjs/common';
import { AIProvider, AIHealthAssistantResponse } from '../interfaces/ai-provider.interface';

const VET_DISCLAIMER =
  'Thông tin trợ lý chỉ mang tính tham khảo y tế ban đầu và TUYỆT ĐỐI không thay thế chẩn đoán trực tiếp của bác sĩ thú y.';

@Injectable()
export class MockAIProvider implements AIProvider {
  private readonly logger = new Logger(MockAIProvider.name);

  async ask(
    question: string, 
    context?: Record<string, any>, 
    history?: { role: 'user' | 'model'; text: string }[]
  ): Promise<AIHealthAssistantResponse> {
    this.logger.log(`[Demo/Mock AI Provider] Processing query: "${question}"`);
    const q = question.toLowerCase();
    const petName = context?.name || 'thú cưng';

    // 1. Poison / Chocolate
    if (q.includes('chocolate') || q.includes('sô cô la') || q.includes('socola') || q.includes('bả') || q.includes('độc')) {
      return {
        riskLevel: 'CRITICAL',
        answer: `CẢNH BÁO: ${petName} có dấu hiệu ngộ độc độc chất/thực phẩm nghiêm trọng. Chất độc có thể gây co giật, suy gan và loạn nhịp tim trong thời gian ngắn.`,
        immediateActions: [
          'Cách ly ngay thú cưng khỏi phần thức ăn/hóa chất còn lại.',
          'Ghi lại loại chất, ước tính liều lượng và thời gian chính xác.',
          'Mang theo bao bì hoặc mẫu chất đến phòng khám thú y gần nhất.',
          'Đưa thú cưng đi cấp cứu trong thời gian vàng (dưới 1-2 giờ) để bác sĩ rửa dạ dày an toàn.'
        ],
        warningSigns: ['Sùi bọt mép', 'Co giật', 'Thở dốc hổn hển', 'Nôn mửa liên tục'],
        whenToSeeVet: 'Đến ngay cơ sở thú y gần nhất, không được trì hoãn.',
        followUpQuestions: ['Bé ăn chocolate đen hay sữa?', 'Khối lượng ăn khoảng bao nhiêu gam?', 'Bé đã xuất hiện triệu chứng gì chưa?'],
        sources: 'Hiệp Hội Bác Sĩ Thú Y Động Vật Nhỏ Thế Giới (WSAVA)',
        disclaimer: VET_DISCLAIMER
      };
    }

    // 2. Vomiting / Diarrhea
    if (q.includes('nôn') || q.includes('ói') || q.includes('tiêu chảy') || q.includes('đi ngoài')) {
      const isBlood = q.includes('máu') || q.includes('tanh');
      return {
        riskLevel: isBlood ? 'CRITICAL' : 'CONSULT_VET',
        answer: `${petName} đang gặp tình trạng kích ứng đường tiêu hóa cấp. Cần phân biệt giữa rối loạn tiêu hóa thông thường với các bệnh do virus nguy hiểm như Parvovirus, Care hay viêm ruột hoại tử.`,
        immediateActions: [
          'Cách ly bé khỏi các bạn thú cưng khác để phòng lây nhiễm.',
          'Tạm ngưng thức ăn đặc trong 6-8 tiếng để ruột nghỉ ngơi.',
          'Kiểm tra nướu xem có hồng hào hay nhợt nhạt, da gáy có đàn hồi không.',
          'Chụp ảnh chất nôn hoặc phân để bác sĩ chẩn đoán chính xác.'
        ],
        warningSigns: ['Nôn liên tục trên 3 lần trong 2 giờ', 'Phân có mùi tanh khắm hoặc lẫn máu tươi', 'Mắt trũng sâu, mất nước'],
        whenToSeeVet: isBlood ? 'Cần đến bác sĩ ngay lập tức' : 'Cần đi khám nếu triệu chứng kéo dài quá 12-24 giờ',
        followUpQuestions: ['Bé nôn mấy lần rồi?', 'Phân có lẫn máu hay mùi tanh khắm không?', 'Bé đã tiêm đủ vaccine chưa?'],
        sources: 'Phác đồ điều trị Tiêu hóa Thú Y AAHA',
        disclaimer: VET_DISCLAIMER
      };
    }

    // 3. Loss of appetite
    if (q.includes('không chịu ăn') || q.includes('bỏ ăn') || q.includes('chán ăn')) {
      return {
        riskLevel: 'CONSULT_VET',
        answer: `Thú cưng bỏ ăn là phản ứng của cơ thể khi bị sốt, đau răng miệng hoặc tắc búi lông. Đặc biệt với mèo, nếu nhịn ăn trên 48 giờ có nguy cơ cao bị Hội chứng Gan nhiễm mỡ (Hepatic Lipidosis) đe dọa tính mạng.`,
        immediateActions: [
          'Kiểm tra nhiệt độ cơ thể (nhiệt độ bình thường của chó mèo là 38.0°C - 39.2°C).',
          'Kiểm tra vòm họng xem có dị vật hay loét miệng không.',
          'Thử hâm ấm pate hoặc nước luộc ức gà để kích thích vị giác.'
        ],
        warningSigns: ['Bỏ ăn kèm sốt cao', 'Mắt lờ đờ, không chịu uống nước', 'Vàng da, vàng mắt'],
        whenToSeeVet: 'Đưa đi khám nếu mèo nhịn ăn trên 24 giờ hoặc chó nhịn ăn trên 48 giờ.',
        followUpQuestions: ['Bé bỏ ăn mấy ngày rồi?', 'Bé có uống nước không?', 'Bé có đi vệ sinh bình thường không?'],
        disclaimer: VET_DISCLAIMER
      };
    }

    // Default guidance
    return {
      riskLevel: 'MONITOR',
      answer: `Cảm ơn bạn đã quan tâm đến sức khỏe của ${petName}. Để đánh giá chính xác hơn, bạn hãy theo dõi sát sao biểu hiện tinh thần, chế độ ăn uống và phân/nước tiểu trong ngày của bé.`,
      immediateActions: [
        'Quan sát tinh thần bé lanh lợi hay ủ rũ.',
        'Đảm bảo luôn có sẵn nước sạch trong bát.',
        'Đo nhiệt độ hậu môn nếu nghi ngờ sốt.'
      ],
      warningSigns: ['Sốt trên 39.3°C', 'Bỏ ăn liên tục', 'Khó thở hoặc nôn mửa'],
      whenToSeeVet: 'Nên liên hệ phòng khám nếu triệu chứng không thuyên giảm sau 24 giờ.',
      followUpQuestions: ['Bé mấy tháng tuổi và nặng bao nhiêu kg?', 'Bé đã tiêm phòng mũi nào chưa?'],
      disclaimer: VET_DISCLAIMER
    };
  }
}
