import { Injectable, Logger } from '@nestjs/common';
import { TriageRequestDto } from './dto/triage-request.dto';

export interface EmergencyTriageResult {
  severity: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  colorCode: 'RED' | 'YELLOW' | 'GREEN';
  title: string;
  immediateActions: string[];
  doNotDo: string[];
  redFlags: string[];
  nextSteps: {
    label: string;
    actionType: 'call' | 'find_vet' | 'share_location' | 'guide';
    detail?: string;
  }[];
  recommendedQuestions: string[];
  disclaimer: string;
}

const MEDICAL_SAFETY_DISCLAIMER =
  'CẢNH BÁO AN TOÀN Y TẾ THÚ Y: Hướng dẫn này chỉ phục vụ sơ cứu bảo vệ tính mạng trong thời gian vàng và TUYỆT ĐỐI không thay thế chẩn đoán trực tiếp của bác sĩ thú y. Hãy đưa thú cưng tới cơ sở thú y gần nhất càng sớm càng tốt.';

@Injectable()
export class EmergencySafetyService {
  private readonly logger = new Logger(EmergencySafetyService.name);

  // Critical indicators
  private readonly criticalKeywords = [
    'bả', 'thuốc chuột', 'thuốc trừ sâu', 'ngộ độc', 'hóa chất', 'thuốc tẩy',
    'chocolate', 'sô cô la', 'socola', 'xylitol',
    'hóc', 'dị vật', 'khó thở', 'thở rít', 'nghẹt thở', 'tím tái',
    'co giật', 'động kinh', 'sùi bọt', 'hôn mê', 'bất tỉnh', 'ngất',
    'tai nạn', 'xe đâm', 'gãy xương', 'chảy máu nhiều', 'xuất huyết', 'rơi lầu',
    'sốc nhiệt', 'say nắng', 'thân nhiệt 40',
    'rắn cắn', 'ong đốt sưng mặt', 'bọ cạp',
    'tiêu chảy ra máu', 'nôn liên tục'
  ];

  isCriticalEmergency(text: string): boolean {
    const lower = text.toLowerCase();
    return this.criticalKeywords.some((keyword) => lower.includes(keyword));
  }

  validateAdvice(text: string): { isSafe: boolean; violations: string[] } {
    const lower = text.toLowerCase();
    const violations: string[] = [];

    if (lower.includes('nước muối') && (lower.includes('nôn') || lower.includes('ép nôn'))) {
      violations.push('Ép nôn bằng nước muối có nguy cơ gây phù não và ngộ độc natri cấp tính.');
    }
    if (lower.includes('trứng gà sống') || lower.includes('trứng sống')) {
      violations.push('Cho ăn trứng sống không giải được độc và có nguy cơ tắc thở hoặc nhiễm khuẩn.');
    }
    if (lower.includes('paracetamol') || lower.includes('panadol')) {
      violations.push('Paracetamol là chất cực độc đối với chó và đặc biệt là mèo (gây Methemoglobin huyết và suy gan cấp).');
    }
    if (lower.includes('dầu hỏa') || lower.includes('nhớt')) {
      violations.push('Tuyệt đối không bôi dầu hỏa hoặc nhớt lên da thú cưng vì gây nhiễm độc hấp thụ.');
    }

    return {
      isSafe: violations.length === 0,
      violations,
    };
  }

  evaluateTriage(dto: TriageRequestDto): EmergencyTriageResult {
    const text = `${dto.problem} ${dto.symptoms || ''} ${dto.suspectedSubstance || ''}`.toLowerCase();
    this.logger.warn(`Evaluating emergency triage for: "${dto.problem}"`);

    // 1. Poisoning / Chemical ingestion -> RED
    if (
      text.includes('bả') ||
      text.includes('thuốc chuột') ||
      text.includes('thuốc trừ sâu') ||
      text.includes('chất độc') ||
      text.includes('hóa chất') ||
      text.includes('thuốc tẩy') ||
      dto.consciousness === 'UNCONSCIOUS'
    ) {
      return {
        severity: 'CRITICAL',
        colorCode: 'RED',
        title: 'MÃ ĐỎ: CÓ THỂ ĐE DỌA TÍNH MẠNG — CẦN ĐẾN BỆNH VIỆN THÚ Y NGAY',
        immediateActions: [
          'Di chuyển thú cưng ngay lập tức khỏi nguồn chất độc để tránh ăn thêm.',
          'Giữ lại bao bì, nhãn hiệu hoặc mẫu chất nghi ngờ nếu an toàn để đưa bác sĩ xem.',
          'Ghi nhận chính xác: thời gian ăn phải (cách đây bao lâu), lượng ước tính và cân nặng của bé.',
          'Gọi điện ngay cho phòng khám thú y gần nhất trên đường di chuyển để họ chuẩn bị thuốc giải độc và trang thiết bị cấp cứu.',
          'Giữ ấm cho thú cưng bằng chăn mỏng, giữ tư thế nằm nghiêng để đường thở thông thoáng.'
        ],
        doNotDo: [
          'TUYỆT ĐỐI KHÔNG tự ý gây nôn bằng cách ép uống nước muối, oxy già hay mẹo dân gian (nguy cơ bỏng thực quản hoặc sặc vào phổi gây tử vong nhanh hơn).',
          'KHÔNG cho ăn trứng gà sống, uống sữa hay dầu ăn bừa bãi khi chưa có chỉ định của bác sĩ thú y.',
          'KHÔNG trì hoãn việc đưa đến bác sĩ để thử các biện pháp truyền miệng tại nhà.'
        ],
        redFlags: [
          'Sùi bọt mép, nôn mửa dữ dội',
          'Co giật, run rẩy toàn thân, mất thăng bằng',
          'Đồng tử co nhỏ hoặc giãn bất thường',
          'Khó thở, thở rống, tím tái nướu lợi',
          'Mất ý thức, hôn mê'
        ],
        nextSteps: [
          { label: 'Gọi bác sĩ thú y / 115 khẩn cấp', actionType: 'call', detail: 'tel:1900115' },
          { label: 'Tìm bệnh viện thú y gần nhất', actionType: 'find_vet' },
          { label: 'Chia sẻ vị trí cho người hỗ trợ', actionType: 'share_location' }
        ],
        recommendedQuestions: [
          'Tên chính xác hoặc chụp ảnh nhãn bao bì chất nghi ngờ?',
          'Thời điểm ăn phải cách đây bao nhiêu phút?',
          'Ước tính lượng thú cưng đã ăn vào?',
          'Hiện tại bé đã xuất hiện triệu chứng nôn hay co giật chưa?'
        ],
        disclaimer: MEDICAL_SAFETY_DISCLAIMER
      };
    }

    // 2. Choking / Airway Obstruction -> RED
    if (text.includes('hóc') || text.includes('dị vật') || text.includes('khó thở') || text.includes('nghẹn') || text.includes('tím tái')) {
      return {
        severity: 'CRITICAL',
        colorCode: 'RED',
        title: 'MÃ ĐỎ: CẤP CỨU THỞ KHẨN CẤP — TẮC NGHẼN ĐƯỜNG THỞ NGUY KỊCH',
        immediateActions: [
          'Nếu thú cưng đang ho mạnh, hãy để thú cưng tự tống dị vật ra ngoài.',
          'Nếu nghẹt thở hoàn toàn: cẩn thận mở miệng, dùng ngón tay gạt nhẹ nếu dị vật nằm ngay cửa miệng (tránh đẩy sâu hơn).',
          'Thực hiện thủ thuật Heimlich thú y: vòng hai tay quanh bụng sát sau xương sườn, ép dứt khoát hướng về phía ngực 3-5 lần.',
          'Đưa ngay đến cơ sở thú y gần nhất nếu dị vật không ra sau 1 phút.'
        ],
        doNotDo: [
          'TUYỆT ĐỐI KHÔNG chọc que hoặc nhíp sâu mù quáng vào họng vì sẽ đẩy dị vật bít kín khí quản.',
          'KHÔNG cho nuốt cơm hay uống nước để nuốt trôi xương.',
          'KHÔNG bóp cổ làm thú cưng hoảng loạn thiếu oxy trầm trọng hơn.'
        ],
        redFlags: [
          'Cào móng liên tục vào miệng trong hoảng loạn',
          'Lưỡi và nướu chuyển sang màu tím tái hoặc xanh nhợt',
          'Ngực phập phồng mạnh nhưng không có khí thở ra',
          'Ngã quỵ, ngất xỉu'
        ],
        nextSteps: [
          { label: 'Gọi hotline thú y có bình thở oxy', actionType: 'call', detail: 'tel:1900115' },
          { label: 'Chỉ đường bệnh viện thú y gần nhất', actionType: 'find_vet' }
        ],
        recommendedQuestions: ['Bé nuốt phải vật gì (xương, bóng, đồ chơi nhựa)?', 'Bé có còn thở ngắt quãng không?'],
        disclaimer: MEDICAL_SAFETY_DISCLAIMER
      };
    }

    // 3. Minor / Routine signs -> GREEN (Monitor at home)
    if (
      text.includes('ngứa') ||
      text.includes('gãi tai') ||
      text.includes('rụng lông') ||
      text.includes('chảy ghèn') ||
      text.includes('hắt hơi nhẹ')
    ) {
      return {
        severity: 'LOW',
        colorCode: 'GREEN',
        title: 'MÃ XANH: TÌNH TRẠNG NHẸ — CÓ THỂ THEO DÕI VÀ CHĂM SÓC TẠI NHÀ',
        immediateActions: [
          'Vệ sinh sạch sẽ vùng tai, mắt hoặc da bị kích ứng bằng nước muối sinh lý 0.9%.',
          'Đeo loa chống liếm (vòng Elizabeth) để tránh bé cào gãi gây trầy xước nhiễm trùng.',
          'Theo dõi thói quen ăn uống và sinh hoạt trong 24-48 giờ tới.'
        ],
        doNotDo: [
          'KHÔNG tự ý nhỏ thuốc kháng sinh hoặc bôi kem mỡ chứa Corticoid của người vào mắt/tai thú cưng.',
          'KHÔNG tắm thú cưng bằng xà phòng người có độ pH không phù hợp gây viêm da.'
        ],
        redFlags: ['Vùng da mưng mủ, có mùi hôi', 'Mắt sưng đỏ, chảy mủ đặc', 'Bỏ ăn hoặc sốt nhẹ'],
        nextSteps: [
          { label: 'Đặt lịch khám định kỳ', actionType: 'guide' },
          { label: 'Tra cứu phòng khám thú y', actionType: 'find_vet' }
        ],
        recommendedQuestions: ['Triệu chứng xuất hiện bao lâu rồi?', 'Gần đây bé có tiếp xúc với cỏ cây lạ không?'],
        disclaimer: MEDICAL_SAFETY_DISCLAIMER
      };
    }

    // 4. Chocolate / Seizures / Mild Digestive -> YELLOW (Urgent / Closely Monitor)
    return {
      severity: 'HIGH',
      colorCode: 'YELLOW',
      title: 'MÃ VÀNG: CẦN THEO DÕI SÁT — KHUYẾN NGHỊ LIÊN HỆ TƯ VẤN BÁC SĨ THÚ Y',
      immediateActions: [
        'Quan sát kỹ tinh thần, nhịp thở và màu sắc nướu răng của bé.',
        'Giữ thú cưng ở nơi thoáng mát, yên tĩnh, hạn chế vận động mạnh.',
        'Ghi nhận lại các biểu hiện bất thường, thời gian và tần suất để báo cáo bác sĩ.',
        'Liên hệ cơ sở thú y gần nhất để được tư vấn phác đồ xử trí ban đầu.'
      ],
      doNotDo: [
        'KHÔNG tự ý cho uống Paracetamol, Panadol, Aspirin hoặc thuốc hạ sốt của người.',
        'KHÔNG ép ăn khi bé đang nôn mửa hoặc lờ đờ.'
      ],
      redFlags: ['Nôn mửa liên tục trên 3 lần/ngày', 'Đi ngoài ra máu tươi', 'Nướu răng nhợt nhạt hoặc tím tái', 'Sốt cao hoặc hạ thân nhiệt'],
      nextSteps: [
        { label: 'Gọi bác sĩ thú y tư vấn', actionType: 'call' },
        { label: 'Tìm phòng khám thú y gần nhất', actionType: 'find_vet' }
      ],
      recommendedQuestions: ['Triệu chứng xuất hiện từ khi nào?', 'Bé có bỏ ăn hoặc nôn ói không?'],
      disclaimer: MEDICAL_SAFETY_DISCLAIMER
    };
  }
}
