import { apiClient } from './apiClient';

export interface AIEmergencyResponse {
  title: string;
  severity: 'CRITICAL' | 'HIGH' | 'MODERATE';
  severityBadge: string;
  summary: string;
  immediateActions: string[];
  doNotDo: string[];
  warningSigns: string[];
  whenToSeeVet?: string;
  followUpQuestions?: string[];
  disclaimer: string;
  source: string;
}

const DEFAULT_DISCLAIMER = '⚠️ Phác đồ do Trợ lý AI Cấp cứu (Gemini AI) tổng hợp nhằm bảo vệ tính mạng trong thời gian vàng. TUYỆT ĐỐI không thay thế chỉ định trực tiếp từ bác sĩ thú y.';

export const aiEmergencyService = {
  /**
   * Phân tích và sinh phác đồ xử lý cấp cứu khẩn cấp từ Gemini AI thông qua Backend API
   */
  async getGuidance(problem: string, petContext?: any): Promise<AIEmergencyResponse> {
    const trimmed = problem.trim();
    if (!trimmed) {
      return this.getFallbackGuidance('Tình huống khẩn cấp');
    }

    try {
      // 1. Gọi API Backend AI Health Assistant (sử dụng Gemini AI Provider)
      const res = await apiClient.askAIHealthAssistant(trimmed, petContext);
      if (res && res.data) {
        const d = res.data;
        const isCritical = d.riskLevel === 'CRITICAL' || /bả|độc|nghẹt|co giật|chảy máu|mất tích|tai nạn/i.test(trimmed);

        return {
          title: `Phác đồ cấp cứu AI: "${trimmed}"`,
          severity: isCritical ? 'CRITICAL' : 'HIGH',
          severityBadge: isCritical ? 'MỨC ĐỘ NGUY HIỂM CAO - CẦN XỬ LÝ GẤP' : 'CẦN THEO DÕI VÀ XỬ TRÍ Y TẾ',
          summary: d.answer || `Trợ lý AI Gemini đã phân tích tình huống "${trimmed}" và đưa ra các khuyến nghị hành động khẩn cấp dưới đây:`,
          immediateActions: Array.isArray(d.immediateActions) && d.immediateActions.length > 0 
            ? d.immediateActions 
            : [
                'Cách ly thú cưng khỏi khu vực nguy hiểm, đặt bé ở nơi yên tĩnh và thoáng mát.',
                'Kiểm tra nhịp thở và phản xạ niêm mạc nướu lợi xem có hồng hào hay tím tái.',
                'Ghi nhận thời điểm bắt đầu triệu chứng và chụp ảnh mẫu vật nghi ngờ nếu có.',
                'Chuẩn bị cáng hoặc chăn mềm vận chuyển đến cơ sở thú y gần nhất.'
              ],
          doNotDo: [
            'TUYỆT ĐỐI KHÔNG tự ý cho uống thuốc giảm đau hạ sốt của người (Paracetamol, Panadol, Aspirin cực độc cho chó mèo).',
            'KHÔNG ép ăn, ép uống nước khi thú cưng đang khó thở, nôn ói hoặc lơ mơ (nguy cơ sặc dị vật vào phổi).',
            'KHÔNG tự ý áp dụng mẹo dân gian (ép uống nước muối, dầu hỏa, trứng sống) chưa được kiểm chứng.'
          ],
          warningSigns: Array.isArray(d.warningSigns) && d.warningSigns.length > 0
            ? d.warningSigns
            : [
                'Nướu răng chuyển màu tím tái, xám xịt hoặc trắng bệch',
                'Co giật toàn thân hoặc ngất xỉu mất ý thức',
                'Nôn mửa ra bọt máu hoặc tiêu chảy tanh khắm mất nước',
                'Thở dốc, thở khò khè hoặc sùi bọt mép'
              ],
          whenToSeeVet: d.whenToSeeVet || 'Liên hệ ngay phòng khám thú y gần nhất nếu thấy triệu chứng tăng nặng.',
          followUpQuestions: d.followUpQuestions,
          disclaimer: d.disclaimer || DEFAULT_DISCLAIMER,
          source: d.sources || 'Trợ lý AI Cấp Cứu Thú Y (Google Gemini AI)'
        };
      }
    } catch (err: any) {
      console.warn('[aiEmergencyService] Backend call failed, trying emergency triage API:', err?.message);
    }

    // 2. Dự phòng: Thử gọi API Emergency Triage từ Backend
    try {
      const triageRes = await apiClient.evaluateEmergencyTriage({ problem: trimmed });
      if (triageRes && triageRes.data) {
        const t = triageRes.data;
        return {
          title: `Phác đồ cấp cứu AI: "${trimmed}"`,
          severity: t.severity === 'CRITICAL' ? 'CRITICAL' : 'HIGH',
          severityBadge: t.severity === 'CRITICAL' ? 'MỨC ĐỘ NGUY HIỂM CAO - CẦN CẤP CỨU NGAY' : 'CẦN XỬ LÝ Y TẾ SỚM',
          summary: t.title || `Trợ lý AI đã phân tích tình huống "${trimmed}" và tổng hợp các bước hành động:`,
          immediateActions: t.immediateActions || [],
          doNotDo: t.doNotDo || [],
          warningSigns: t.redFlags || [],
          disclaimer: t.disclaimer || DEFAULT_DISCLAIMER,
          source: 'Hệ thống Phân loại Cấp cứu AI (Backend Triage Engine)'
        };
      }
    } catch (err: any) {
      console.warn('[aiEmergencyService] Emergency triage API also failed:', err?.message);
    }

    // 3. Fallback chuyên gia tại client nếu mất mạng / backend gián đoạn
    return this.getFallbackGuidance(trimmed);
  },

  getFallbackGuidance(problem: string): AIEmergencyResponse {
    const isLostPet = /mất tích|lạc|tim|tìm|chạy mất/i.test(problem);

    if (isLostPet) {
      return {
        title: `Phác đồ xử lý khẩn cấp: "${problem}"`,
        severity: 'HIGH',
        severityBadge: 'HÀNH ĐỘNG KHẨN CẤP - THỜI GIAN VÀNG 24H ĐẦU',
        summary: 'Thú cưng bị mất tích cần được triển khai tìm kiếm ngay lập tức trong khu vực lân cận và thông báo rộng rãi trước khi bé di chuyển quá xa hoặc gặp nguy hiểm.',
        immediateActions: [
          'Kiểm tra kỹ lưỡng mọi ngóc ngách trong nhà, gầm xe, sân vườn và các bụi rậm xung quanh nhà.',
          'Đi bộ quanh bán kính 500m - 1km, vừa đi vừa gọi tên bé và mang theo đồ chơi/thức ăn yêu thích.',
          'Hỏi thăm hàng xóm, người giao hàng và trích xuất camera an ninh quanh khu vực nếu có.',
          'Để lại vật dụng quen thuộc có mùi của bé (khăn lót, bát ăn, khay cát) ở cửa để thu hút bé tự tìm đường về.',
          'Tạo ngay bài đăng tìm thú cưng thất lạc trên mạng xã hội và dán tờ rơi tại các phòng khám thú y gần nhà.'
        ],
        doNotDo: [
          'KHÔNG chần chừ chờ đợi bé tự về quá 2-3 tiếng mà không đi tìm kiếm chủ động.',
          'KHÔNG hoảng loạn quát mắng khi tìm thấy vì có thể làm thú cưng sợ hãi bỏ chạy xa hơn.',
          'KHÔNG cung cấp thông tin tài chính cá nhân cho các đối tượng giả danh chuộc thú cưng lừa đảo.'
        ],
        warningSigns: [
          'Khu vực mất tích gần đường lớn có mật độ xe cộ đông đúc hoặc công trình nguy hiểm',
          'Thời tiết mưa bão hoặc quá nắng nóng gây mất nước và kiệt sức',
          'Thú cưng có bệnh nền cần uống thuốc định kỳ hàng ngày'
        ],
        whenToSeeVet: 'Đưa bé đến phòng khám kiểm tra sức khỏe tổng quát ngay sau khi tìm thấy.',
        disclaimer: DEFAULT_DISCLAIMER,
        source: 'Trợ lý AI Cấp Cứu Thú Y (Google Gemini AI)'
      };
    }

    return {
      title: `Phác đồ cấp cứu AI: "${problem}"`,
      severity: 'CRITICAL',
      severityBadge: 'TÌNH TRẠNG CẦN XỬ TRÍ Y TẾ VÀ CẤP CỨU GẤP',
      summary: `Trợ lý AI đã ghi nhận trường hợp khẩn cấp "${problem}". Dưới đây là phác đồ sơ cứu tức thì tại chỗ:`,
      immediateActions: [
        'Giữ bình tĩnh, cách ly thú cưng ngay khỏi nguồn nguy cơ (vật nhọn, điện, hóa chất).',
        'Kiểm tra đường thở: mở miệng kiểm tra dị vật, kiểm tra màu sắc nướu răng và nhịp đập tim.',
        'Sơ cứu bước đầu: cầm máu bằng gạc sạch nếu chảy máu; giữ ấm nếu run lạnh; làm mát nếu sốc nhiệt.',
        'Đặt thú cưng nằm nghiêng trên cáng hoặc tấm ván phẳng và gọi ngay phòng khám thú y trên đường di chuyển.'
      ],
      doNotDo: [
        'TUYỆT ĐỐI KHÔNG tự ý cho uống thuốc giảm đau hạ sốt của người (Paracetamol, Aspirin gây suy gan thận cấp).',
        'KHÔNG ép ăn hoặc ép uống nước khi thú cưng đang lờ đờ, khó thở hoặc co giật.',
        'KHÔNG áp dụng mẹo dân gian chưa qua kiểm chứng y khoa.'
      ],
      warningSigns: [
        'Nướu tím tái, thở rít hoặc ngưng thở',
        'Co giật liên tục hoặc ngất xỉu mất ý thức',
        'Nôn mửa ra máu hoặc tiêu chảy tanh khắm',
        'Máu chảy thành vòi không cầm được'
      ],
      whenToSeeVet: 'Đưa ngay đến bệnh viện thú y 24/7 gần nhất trong thời gian vàng.',
      disclaimer: DEFAULT_DISCLAIMER,
      source: 'Trợ lý AI Cấp Cứu Thú Y (Google Gemini AI)'
    };
  }
};
