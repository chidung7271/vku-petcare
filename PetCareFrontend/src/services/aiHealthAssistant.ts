import { apiClient } from './apiClient';

export type AIUrgency = 'CRITICAL' | 'CONSULT_VET' | 'MONITOR';

export interface AIResponse {
  answer: string;
  urgency: AIUrgency;
  urgencyBadge: string;
  doList?: string[];
  dontList?: string[];
  followUpChips: string[];
  disclaimer: string;
}

const MEDICAL_DISCLAIMER = '⚠️ Thông tin trợ lý chỉ mang tính tham khảo y tế ban đầu và TUYỆT ĐỐI không thay thế chẩn đoán trực tiếp của bác sĩ thú y.';

export interface AIPetContext {
  name?: string;
  species?: string;
  breed?: string;
  weight?: number;
  age?: string;
  allergies?: string[];
  chronicConditions?: string[];
  isNeutered?: boolean;
}

export const aiHealthAssistant = {
  async ask(
    question: string, 
    petContext?: AIPetContext,
    history?: { role: 'user' | 'model'; text: string }[]
  ): Promise<AIResponse> {
    // 1. Try backend API first
    try {
      const res = await apiClient.askAIHealthAssistant(question, petContext, history);
      if (res && res.data) {
        const d = res.data;
        const urgencyMap: Record<string, { urgency: AIUrgency; badge: string }> = {
          CRITICAL: { urgency: 'CRITICAL', badge: 'CẦN CẤP CỨU THÚ Y NGAY LẬP TỨC' },
          CONSULT_VET: { urgency: 'CONSULT_VET', badge: 'NÊN ĐƯA ĐI KHÁM THÚ Y' },
          MONITOR: { urgency: 'MONITOR', badge: 'THEO DÕI TẠI NHÀ' },
        };
        const mapped = urgencyMap[d.riskLevel] || { urgency: 'MONITOR', badge: 'HỖ TRỢ THÔNG TIN' };

        return {
          answer: d.answer,
          urgency: mapped.urgency,
          urgencyBadge: mapped.badge,
          doList: d.immediateActions,
          dontList: d.warningSigns ? d.warningSigns.map((w: string) => `Dấu hiệu nguy hiểm: ${w}`) : undefined,
          followUpChips: d.followUpQuestions || ['Bé đang có triệu chứng gì?', 'Bé mấy tuổi và nặng bao nhiêu kg?'],
          disclaimer: d.disclaimer || MEDICAL_DISCLAIMER,
        };
      }
    } catch {
      // Backend unavailable or error, continue to built-in rules engine below
    }

    // 2. Built-in instant expert clinical rules
    await new Promise(r => setTimeout(r, 400));
    const q = question.toLowerCase();

    // 1. Critical & Poison
    if (q.includes('chocolate') || q.includes('socola') || q.includes('bả') || q.includes('thuốc chuột') || q.includes('hóa chất')) {
      return {
        answer: `CẢNH BÁO KHẨN CẤP: ${petContext?.name || 'Thú cưng'} có dấu hiệu ngộ độc thực phẩm/hóa chất nghiêm trọng. Độc tố có thể gây tổn thương thần kinh, suy gan cấp và loạn nhịp tim trong thời gian ngắn.`,
        urgency: 'CRITICAL',
        urgencyBadge: 'CẦN CẤP CỨU THÚ Y NGAY LẬP TỨC',
        doList: [
          'Cách ly ngay thú cưng khỏi phần thức ăn/hóa chất còn lại.',
          'Ghi lại loại chất, ước tính lượng ăn phải và thời gian chính xác.',
          'Mang theo bao bì hoặc mẫu chất đến phòng khám thú y gần nhất.',
          'Đưa thú cưng đi cấp cứu trong thời gian vàng (dưới 1-2 giờ) để bác sĩ rửa dạ dày an toàn.'
        ],
        dontList: [
          'TUYỆT ĐỐI KHÔNG tự gây nôn bằng nước muối, oxy già hoặc mẹo dân gian (nguy cơ sặc phổi và tử vong).',
          'Không cho uống sữa hay lòng trắng trứng bừa bãi khi chưa có chỉ định.'
        ],
        followUpChips: ['Tìm viện thú y gần nhất', 'Gọi cấp cứu 24/7', 'Cách nhận biết chocolate đen hay sữa'],
        disclaimer: MEDICAL_DISCLAIMER
      };
    }

    // 2. Choking / Breathing
    if (q.includes('hóc') || q.includes('khó thở') || q.includes('thở dốc') || q.includes('nghẹn') || q.includes('xương')) {
      return {
        answer: `TÌNH TRẠNG NGUY KỊCH: Đường thở của ${petContext?.name || 'bé'} có thể đang bị bít tắc hoặc tràn dịch màng phổi. Não bộ chỉ chịu được thiếu oxy trong vòng 3-4 phút.`,
        urgency: 'CRITICAL',
        urgencyBadge: 'NGHẸT THỞ CẤP TÍNH',
        doList: [
          'Kiểm tra nhẹ nhàng trong vòm họng nếu thấy dị vật ở cửa miệng thì dùng ngón tay gạt ra.',
          'Thực hiện Heimlich thú y: Đặt 2 tay ôm vòng quanh bụng sát xương sườn và ấn dứt khoát 3-4 lần hướng về phía ngực.',
          'Giữ thú cưng ở tư thế thẳng cổ để luồng không khí thông suốt.',
          'Chở ngay đến phòng khám thú y có bình thở oxy.'
        ],
        dontList: [
          'Không thọc sâu que hoặc ngón tay mù quáng vì sẽ đẩy dị vật vào sâu khí quản.',
          'Không cho ăn cục cơm hay uống nước để nuốt trôi.'
        ],
        followUpChips: ['Xem video sơ cứu Heimlich', 'Gọi bác sĩ thú y', 'Phòng khám có bình oxy'],
        disclaimer: MEDICAL_DISCLAIMER
      };
    }

    // 3. Vomiting / Diarrhea
    if (q.includes('nôn') || q.includes('ói') || q.includes('tiêu chảy') || q.includes('đi ngoài') || q.includes('ra máu')) {
      const isSevere = q.includes('máu') || q.includes('liên tục') || q.includes('nhiều lần') || q.includes('bỏ ăn');
      return {
        answer: `${petContext?.name || 'Bé'} đang bị kích ứng đường tiêu hóa cấp. Cần phân biệt giữa rối loạn tiêu hóa nhẹ do đổi thức ăn với các bệnh truyền nhiễm nguy hiểm như Parvovirus, Care hay viêm ruột hoại tử.`,
        urgency: isSevere ? 'CRITICAL' : 'CONSULT_VET',
        urgencyBadge: isSevere ? 'NGUY HIỂM: NGUY CƠ MẤT NƯỚC CẤP' : 'NÊN ĐƯA ĐI KHÁM THÚ Y',
        doList: [
          'Cách ly bé khỏi các bạn thú cưng khác để phòng lây nhiễm.',
          'Tạm ngưng thức ăn đặc trong 6-8 tiếng để ruột nghỉ ngơi.',
          'Kiểm tra niêm mạc nướu xem có hồng hào hay nhợt nhạt, da gáy có đàn hồi không.',
          'Chụp ảnh chất nôn hoặc phân để bác sĩ chẩn đoán chính xác.',
          'Đưa đi test nhanh Parvo/Care nếu chưa tiêm phòng đầy đủ.'
        ],
        dontList: [
          'Không tự mua thuốc tiêu chảy người (Berberin, Imodium) cho uống vì liều lượng khác biệt và có thể gây độc.',
          'Không ép uống một lượng lớn nước cùng lúc.'
        ],
        followUpChips: ['Bé nôn mấy lần rồi?', 'Phân có mùi tanh khắm không?', 'Bé đã tiêm đủ vaccine chưa?', 'Cân nặng của bé?'],
        disclaimer: MEDICAL_DISCLAIMER
      };
    }

    // 4. Loss of Appetite
    if (q.includes('không chịu ăn') || q.includes('bỏ ăn') || q.includes('chán ăn') || q.includes('nhịn ăn')) {
      return {
        answer: `Thú cưng bỏ ăn là phản ứng đầu tiên của cơ thể khi bị sốt, đau răng miệng, tắc búi lông hoặc viêm nhiễm nội tạng. Đặc biệt với mèo, nếu nhịn ăn trên 48 giờ có nguy cơ cao bị Hội chứng Gan nhiễm mỡ (Hepatic Lipidosis) đe dọa tính mạng.`,
        urgency: 'CONSULT_VET',
        urgencyBadge: 'THEO DÕI & KHÁM NẾU TRÊN 24H',
        doList: [
          'Kiểm tra nhiệt độ cơ thể (nhiệt độ bình thường của chó mèo là 38.0°C - 39.2°C).',
          'Kiểm tra miệng và răng xem có bị viêm nướu, loét miệng hay hóc xương cá không.',
          'Thử hâm ấm pate hoặc nước luộc ức gà để tăng mùi thơm kích thích vị giác.',
          'Nếu đã bỏ ăn quá 24h đối với mèo hoặc 48h đối với chó, cần đưa đi khám xét nghiệm máu.'
        ],
        dontList: [
          'Không ép thú cưng ăn bằng cách bơm xi lanh nếu bé đang buồn nôn (gây sặc viêm phổi).',
          'Không cho ăn thức ăn có gia vị mặn, hành, tỏi, cay nóng.'
        ],
        followUpChips: ['Bé bỏ ăn mấy ngày rồi?', 'Bé có uống nước không?', 'Bé có đi tiểu/tiêu bình thường không?'],
        disclaimer: MEDICAL_DISCLAIMER
      };
    }

    // 5. Parasites / Fleas / Ticks
    if (q.includes('ve') || q.includes('rận') || q.includes('bọ chét') || q.includes('ngứa') || q.includes('gãi')) {
      return {
        answer: `Ve, rận và bọ chét không chỉ gây ngứa, viêm da mà còn là vật chủ truyền bệnh ký sinh trùng máu (Babesia, Ehrlichia) và sán dây rất nguy hiểm.`,
        urgency: 'MONITOR',
        urgencyBadge: 'ĐIỀU TRỊ NGOẠI KÝ SINH TRÙNG',
        doList: [
          'Sử dụng viên nhai ngừa ve rận định kỳ (như NexGard, Bravecto, Simparica) hoặc thuốc nhỏ gáy (Frontline, Revolution) đúng trọng lượng.',
          'Vệ sinh, giặt đệm nằm của thú cưng bằng nước nóng.',
          'Hút bụi kỹ các góc nhà, kẽ tường nơi ve đẻ trứng.',
          'Nếu phát hiện niêm mạc nướu nhợt nhạt hoặc nước tiểu màu xá xị, phải đưa đi xét nghiệm máu ngay.'
        ],
        dontList: [
          'Không dùng nhíp giật mạnh ve làm đứt đầu ve dính lại trong da gây nhiễm trùng.',
          'Không xịt thuốc diệt muỗi người trực tiếp lên lông thú cưng.'
        ],
        followUpChips: ['Thuốc ngừa ve tốt nhất', 'Lịch nhỏ gáy định kỳ', 'Cách trị ve tận gốc trong nhà'],
        disclaimer: MEDICAL_DISCLAIMER
      };
    }

    // 6. Vaccination / Deworming questions
    if (q.includes('vaccine') || q.includes('tiêm') || q.includes('tẩy giun') || q.includes('chích ngừa')) {
      return {
        answer: `Lịch tiêm phòng và tẩy giun chuẩn thú y:
• Chó con: Tiêm mũi đầu lúc 6-8 tuần tuổi, nhắc lại 2-3 mũi cách nhau 3-4 tuần, sau đó tiêm dại và nhắc lại hàng năm.
• Mèo con: Tiêm vaccine 3 hoặc 4 bệnh từ 8 tuần tuổi, nhắc lại sau 3-4 tuần và tiêm dại, sau đó nhắc lại hàng năm.
• Tẩy giun: Từ 2 tuần đến 3 tháng tuổi tẩy 2 tuần/lần; từ 3-6 tháng tẩy 1 tháng/lần; sau 6 tháng tẩy định kỳ 3 tháng/lần.`,
        urgency: 'MONITOR',
        urgencyBadge: 'LỊCH Y TẾ DỰ PHÒNG',
        doList: [
          'Chỉ tiêm phòng khi thú cưng hoàn toàn khỏe mạnh, không sốt, không tiêu chảy.',
          'Tẩy giun trước khi tiêm phòng khoảng 1 tuần để vaccine đạt hiệu quả miễn dịch tối đa.',
          'Theo dõi phản ứng sốc thuốc trong 30 phút tại phòng khám sau khi tiêm.'
        ],
        dontList: [
          'Không tắm cho thú cưng trong vòng 7 ngày sau khi tiêm vaccine.',
          'Không đưa cún/mèo con ra ngoài giao lưu công viên khi chưa tiêm đủ mũi vaccine cơ bản.'
        ],
        followUpChips: ['Xem lịch tiêm của bé', 'Dấu hiệu sốc vaccine', 'Bé mấy tháng tuổi rồi?'],
        disclaimer: MEDICAL_DISCLAIMER
      };
    }

    // 7. General Nutrition & Safe Food
    if (q.includes('ăn được') || q.includes('thức ăn') || q.includes('dinh dưỡng') || q.includes('cá') || q.includes('thịt')) {
      return {
        answer: `Nguyên tắc dinh dưỡng lành mạnh cho thú cưng:
• Thức ăn an toàn: Thịt gà nạc (bỏ xương), thịt bò, thịt lợn nạc, cá hấp chín bỏ xương kỹ, bí đỏ, cà rốt, chuối chín, táo (bỏ hạt).
• Thức ăn TUYỆT ĐỐI CẤM: Xương gà/vịt sắc nhọn, hành, tỏi, hẹ, chocolate, nho khô/tươi, bơ (avocado), macadamia, đồ uống có cồn/caffeine, bánh kẹo có Xylitol.`,
        urgency: 'MONITOR',
        urgencyBadge: 'DINH DƯỠNG & AN TOÀN',
        doList: [
          'Luôn nấu chín kỹ thức ăn để tránh nhiễm khuẩn Salmonella và giun sán.',
          'Cung cấp nước sạch không giới hạn 24/7.',
          'Duy trì cân nặng lý tưởng theo thể trạng giống loài.'
        ],
        dontList: [
          'Không nêm muối, mắm, mì chính hay đường vào đồ ăn của thú cưng.',
          'Không cho ăn xương nấu chín vì xương giòn dễ vỡ vụn đâm thủng ruột.'
        ],
        followUpChips: ['Chó ăn được trái cây gì?', 'Lượng thức ăn mỗi ngày', 'Cách đổi thức ăn không bị tiêu chảy'],
        disclaimer: MEDICAL_DISCLAIMER
      };
    }

    // Default intelligent assistant fallback
    return {
      answer: `Cảm ơn bạn đã hỏi về tình trạng của ${petContext?.name || 'thú cưng'}. Để hỗ trợ chính xác hơn về sức khỏe và phác đồ chăm sóc, bác sĩ khuyến nghị bạn cung cấp thêm thông tin về triệu chứng và độ tuổi của bé.`,
      urgency: 'MONITOR',
      urgencyBadge: 'HỖ TRỢ THÔNG TIN',
      doList: [
        'Quan sát kỹ biểu hiện tinh thần (lanh lợi hay ủ rũ, lờ đờ).',
        'Kiểm tra lượng nước uống và phân/nước tiểu trong ngày.',
        'Đo nhiệt độ hậu môn nếu nghi ngờ sốt (trên 39.3°C là sốt).'
      ],
      dontList: [
        'Không tự ý cho uống thuốc hạ sốt, kháng sinh của người.',
        'Không để tình trạng ủ rũ kéo dài quá 24h.'
      ],
      followUpChips: ['Bé đang có triệu chứng gì?', 'Bé mấy tuổi và nặng bao nhiêu kg?', 'Bé bị như vậy bao lâu rồi?'],
      disclaimer: MEDICAL_DISCLAIMER
    };
  }
};
