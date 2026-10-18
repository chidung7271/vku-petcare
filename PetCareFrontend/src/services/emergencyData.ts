import { EmergencyCase } from '../types';

export const EMERGENCY_CASES: EmergencyCase[] = [
  {
    id: 'poison_toxic',
    title: 'Ăn phải bả / Hóa chất / Độc tố',
    keywords: ['bả', 'độc', 'hóa chất', 'thuốc chuột', 'thuốc diệt cỏ', 'chất độc', 'xà phòng', 'tẩy rửa', 'thuốc trừ sâu'],
    urgencyLevel: 'CRITICAL',
    badgeLabel: 'NGUY CƠ TỬ VONG CAO - CẦN CẤP CỨU GẤP',
    summary: 'Ngộ độc là tình trạng đe dọa trực tiếp tính mạng thú cưng trong thời gian ngắn (vài chục phút đến vài giờ). Cần liên hệ ngay cơ sở thú y gần nhất.',
    doImmediately: [
      'Cách ly thú cưng ngay lập tức khỏi nguồn chất độc để tránh ăn thêm.',
      'Giữ lại mẫu chất độc, bao bì hoặc chụp ảnh nhãn hiệu hóa chất nghi ngờ để đưa cho bác sĩ xem.',
      'Ghi nhận chính xác: Thời điểm ăn phải (cách đây bao lâu), ước tính liều lượng và cân nặng hiện tại của bé.',
      'Gọi điện ngay cho phòng khám thú y gần nhất trên đường di chuyển để họ chuẩn bị sẵn thuốc giải độc và máy móc cấp cứu.',
      'Giữ ấm cho thú cưng bằng chăn mỏng, giữ tư thế nằm nghiêng đầu để đường thở thông thoáng nếu thú cưng yếu.'
    ],
    doNotDo: [
      'TUYỆT ĐỐI KHÔNG tự ý gây nôn bằng cách ép uống nước muối, oxy già hoặc mẹo dân gian (có thể làm bỏng thực quản hoặc hít sặc vào phổi gây tử vong nhanh hơn).',
      'KHÔNG cho uống lòng trắng trứng sống, sữa hay dầu ăn bừa bãi khi chưa có chỉ định của bác sĩ.',
      'KHÔNG trì hoãn thời gian vàng cấp cứu để chờ xem thú cưng có tự khỏi không.'
    ],
    dangerSigns: [
      'Sùi bọt mép, nôn mửa dữ dội',
      'Co giật, run rẩy toàn thân, mất thăng bằng',
      'Đồng tử giãn hoặc co nhỏ bất thường',
      'Thở gấp, thở rống, tím tái nướu lợi',
      'Hôn mê, mất ý thức hoặc liệt'
    ],
    nextActions: [
      { label: 'Gọi cấp cứu thú y ngay', actionType: 'call', detail: 'tel:1900115' },
      { label: 'Tìm bệnh viện thú y gần nhất', actionType: 'find_vet' },
      { label: 'Chia sẻ vị trí cho người hỗ trợ', actionType: 'share_location' }
    ]
  },
  {
    id: 'chocolate_xylitol',
    title: 'Ăn phải Chocolate / Bánh kẹo Xylitol',
    keywords: ['chocolate', 'sô cô la', 'socola', 'xylitol', 'kẹo cao su', 'kẹo ngọt', 'nho', 'hành tỏi'],
    urgencyLevel: 'HIGH',
    badgeLabel: 'NGỘ ĐỘC THỰC PHẨM NGUY HIỂM',
    summary: 'Theobromine trong Chocolate và chất làm ngọt Xylitol là chất cực độc đối với chó mèo, gây suy gan cấp, tụt đường huyết nghiêm trọng và loạn nhịp tim.',
    doImmediately: [
      'Lấy phần bánh kẹo còn lại ra khỏi miệng thú cưng nếu còn an toàn.',
      'Thu thập bao bì để biết loại chocolate (chocolate đen/cacao nguyên chất có độc tính cao gấp 5-10 lần chocolate sữa).',
      'Liên hệ ngay bác sĩ thú y để được tư vấn xem lượng ăn phải so với trọng lượng cơ thể thú cưng có vượt ngưỡng độc hay không.',
      'Nếu mới ăn trong vòng 30-45 phút, đưa đến thú y ngay để bác sĩ tiến hành rửa dạ dày và cho uống than hoạt tính chuyên dụng.'
    ],
    doNotDo: [
      'KHÔNG tự ý dùng thuốc hạ sốt của người (như Paracetamol/Panadol) - cực kỳ độc với mèo và chó!',
      'KHÔNG ép uống nước ngọt hoặc đường nếu nghi ngờ ngộ độc Xylitol vì cần đo đường huyết chính xác.',
      'KHÔNG chờ đến khi thú cưng có triệu chứng co giật mới đi khám.'
    ],
    dangerSigns: [
      'Tim đập nhanh bất thường, bồn chồn, tăng động',
      'Nôn mửa, tiêu chảy, khát nước liên tục',
      'Đi đứng lảo đảo, run rẩy cơ bắp',
      'Co giật, sụp đổ cơ thể, nướu nhợt nhạt'
    ],
    nextActions: [
      { label: 'Gọi bác sĩ tư vấn liều lượng', actionType: 'call' },
      { label: 'Tìm phòng khám thú y mở cửa', actionType: 'find_vet' }
    ]
  },
  {
    id: 'choking',
    title: 'Bị hóc dị vật / Khó thở nghẹt',
    keywords: ['hóc', 'dị vật', 'khó thở', 'nghẹn', 'xương', 'đồ chơi', 'thắt cổ'],
    urgencyLevel: 'CRITICAL',
    badgeLabel: 'CẤP CỨU THỞ KHẨN CẤP - THỜI GIAN VÀNG 3 PHÚT',
    summary: 'Đường thở bị tắc nghẽn do hóc xương, bi, bóng nhỏ hoặc đồ chơi khiến thú cưng thiếu oxy nhanh chóng.',
    doImmediately: [
      'Quan sát xem thú cưng có còn thở hay tự ho được không. Nếu đang ho khạc mạnh, để thú cưng tự tống dị vật ra.',
      'Nếu thú cưng nghẹt thở hoàn toàn: cẩn thận mở miệng, dùng ngón tay kéo lưỡi ra và quét nhẹ nếu nhìn thấy dị vật ngay cửa họng (cẩn thận tránh bị cắn hoặc đẩy dị vật sâu hơn).',
      'Thực hiện thủ thuật Heimlich thú y: Đặt thú cưng đứng hoặc nghiêng, dùng hai tay ôm sát bụng ngay dưới khung xương sườn, ấn dứt khoát hướng lên phía trước ngực 3-5 lần.',
      'Đưa ngay đến cơ sở thú y gần nhất nếu không lấy được dị vật sau 1 phút.'
    ],
    doNotDo: [
      'KHÔNG cố chọc que hoặc nhíp mù quáng vào sâu cuống họng vì sẽ đẩy dị vật vào khí quản gây bít tắc vĩnh viễn.',
      'KHÔNG cho ăn cục cơm hay uống nước để "nuốt trôi xương" như mẹo dân gian.',
      'KHÔNG bóp chặt cổ hoặc làm thú cưng hoảng loạn thở dốc hơn.'
    ],
    dangerSigns: [
      'Cào móng liên tục vào miệng hoặc họng trong hoảng loạn',
      'Nướu và lưỡi chuyển sang màu tím tái hoặc xanh xao',
      'Ngực phập phồng mạnh nhưng không có hơi thở ra',
      'Ngã quỵ, ngất xỉu, đồng tử giãn'
    ],
    nextActions: [
      { label: 'Gọi hotline cấp cứu ngay', actionType: 'call' },
      { label: 'Chỉ đường bệnh viện thú y gần nhất', actionType: 'find_vet' }
    ]
  },
  {
    id: 'trauma_accident',
    title: 'Bị tai nạn xe / Rơi từ trên cao / Chảy máu nhiều',
    keywords: ['tai nạn', 'xe đâm', 'ngã', 'rơi lầu', 'chảy máu', 'gãy xương', 'vết thương', 'chấn thương'],
    urgencyLevel: 'CRITICAL',
    badgeLabel: 'CHẤN THƯƠNG NẶNG - XUẤT HUYẾT NỘI',
    summary: 'Thú cưng bị tai nạn giao thông hoặc rơi lầu có thể bị sốc, gãy xương, tràn khí màng phổi hoặc xuất huyết nội tạng nguy hiểm.',
    doImmediately: [
      'Tiếp cận thật nhẹ nhàng: Thú cưng đang đau đớn dữ dội có thể cắn theo phản xạ tự vệ. Có thể dùng khăn quấn quanh mõm nếu cần.',
      'Cầm máu vết thương hở: Dùng gạc hoặc khăn sạch ép trực tiếp lên vết thương chảy máu liên tục ít nhất 5-10 phút.',
      'Cố định cột sống và cơ thể: Đặt thú cưng nằm nghiêng trên một tấm ván phẳng, chăn dày hoặc thùng carton cứng làm cáng di chuyển.',
      'Che giữ ấm cơ thể bằng chăn mỏng để chống sốc mất máu.',
      'Vận chuyển thật nhẹ nhàng đến bệnh viện có trang bị chụp X-quang và siêu âm cấp cứu.'
    ],
    doNotDo: [
      'KHÔNG bế xốc thú cưng theo tư thế đứng hoặc để cơ thể bị uốn cong (có thể làm đứt tủy sống gãy).',
      'KHÔNG cố nắn chỉnh xương gãy hoặc nhét các phần tổn thương trở lại.',
      'KHÔNG cho ăn hoặc uống bất cứ thứ gì (chuẩn bị cho gây mê phẫu thuật khẩn cấp).'
    ],
    dangerSigns: [
      'Máu chảy thành tia hoặc không cầm sau 5 phút ép',
      'Thở hổn hển, bụng phình to nhanh chóng (dấu hiệu xuất huyết ổ bụng)',
      'Nướu trắng bệch hoặc xám xịt',
      'Bất tỉnh, đồng tử hai bên không đều'
    ],
    nextActions: [
      { label: 'Gọi xe cấp cứu / Viện thú y', actionType: 'call' },
      { label: 'Bệnh viện thú y có X-quang gần nhất', actionType: 'find_vet' }
    ]
  },
  {
    id: 'heatstroke',
    title: 'Sốc nhiệt (Heatstroke) / Say nắng',
    keywords: ['sốc nhiệt', 'nắng', 'nóng', 'say nắng', 'thở dốc', 'nhiệt độ', 'sốt'],
    urgencyLevel: 'HIGH',
    badgeLabel: 'CẦN HẠ NHIỆT KHẨN CẤP AN TOÀN',
    summary: 'Chó mèo không có tuyến mồ hôi toàn thân như người. Nhiệt độ cơ thể vượt 40.5°C có thể gây phù não, suy đa cơ quan và đông máu nội mạch.',
    doImmediately: [
      'Di chuyển ngay vào nơi thoáng mát, có quạt hoặc điều hòa.',
      'Làm mát an toàn: Dùng khăn thấm NƯỚC MÁT THƯỜNG (không dùng nước đá lạnh) đắp vào vùng bẹn, nách, đệm bàn chân và sau tai.',
      'Bật quạt thổi nhẹ vào người để hỗ trợ bay hơi hạ nhiệt.',
      'Cho uống từng ngụm nhỏ nước mát nếu thú cưng còn tỉnh táo và tự liếm được.',
      'Đo nhiệt độ hậu môn nếu có nhiệt kế (dừng làm mát khi thân nhiệt giảm về 39°C để tránh tụt thân nhiệt ngược).'
    ],
    doNotDo: [
      'TUYỆT ĐỐI KHÔNG ngâm toàn bộ cơ thể vào nước đá lạnh hoặc dội nước đá (gây co mạch ngoại vi đột ngột, giữ nhiệt bên trong nội tạng phá hủy cơ quan).',
      'KHÔNG ép thú cưng uống nước khi đang thở dốc hổn hển hoặc lơ mơ (sẽ gây sặc vào phổi).'
    ],
    dangerSigns: [
      'Thở dốc dữ dội, lưỡi đỏ bầm hoặc tím tái thè dài',
      'Nước dãi chảy dính đặc',
      'Mắt đờ đẫn, đi đứng xiêu vẹo rồi ngã khuỵu',
      'Nôn mửa ra máu hoặc tiêu chảy mất tự chủ'
    ],
    nextActions: [
      { label: 'Gọi bác sĩ hướng dẫn', actionType: 'call' },
      { label: 'Đưa đến phòng khám thú y', actionType: 'find_vet' }
    ]
  },
  {
    id: 'seizure',
    title: 'Co giật / Động kinh liên tục',
    keywords: ['co giật', 'động kinh', 'sùi bọt', 'giật', 'ngất', 'run rẩy'],
    urgencyLevel: 'HIGH',
    badgeLabel: 'CẦN BẢO VỆ ĐƯỜNG THỞ VÀ ĐẦU',
    summary: 'Cơn co giật kéo dài trên 3-5 phút hoặc lặp lại liên tiếp (Status Epilepticus) có thể gây tổn thương não vĩnh viễn.',
    doImmediately: [
      'Bình tĩnh, ghi nhớ hoặc dùng điện thoại quay lại video ngắn cơn giật để bác sĩ chẩn đoán chính xác dạng động kinh.',
      'Dọn dẹp tất cả đồ đạc sắc nhọn, bàn ghế xung quanh để thú cưng không bị va đập chấn thương.',
      'Tắt đèn sáng chói, tắt âm thanh ồn ào xung quanh để giảm kích thích thần kinh.',
      'Lót gối mềm hoặc chăn dưới đầu bé.',
      'Khi cơn giật ngưng: Giữ ấm và đưa đến thú y kiểm tra nguyên nhân (hạ đường huyết, ngộ độc hay động kinh).'
    ],
    doNotDo: [
      'TUYỆT ĐỐI KHÔNG cho tay hoặc que vào miệng thú cưng (chó mèo KHÔNG tự cắn đứt lưỡi, bạn sẽ bị cắn nát ngón tay theo phản xạ nghiến cơ hàm).',
      'KHÔNG ghì chặt hoặc đè ép cơ thể khi thú cưng đang giật cơ.',
      'KHÔNG cho ăn, uống bất kỳ thứ gì ngay sau cơn giật vì thú cưng đang trong trạng thái lú lẫn sau giật.'
    ],
    dangerSigns: [
      'Cơn giật kéo dài liên tục trên 3 phút không dứt',
      'Xảy ra từ 2 cơn giật trở lên trong vòng 24 giờ',
      'Không tỉnh lại sau cơn giật, hôn mê sâu'
    ],
    nextActions: [
      { label: 'Gọi cấp cứu thú y', actionType: 'call' },
      { label: 'Tìm phòng khám thần kinh / cấp cứu', actionType: 'find_vet' }
    ]
  },
  {
    id: 'vomit_diarrhea',
    title: 'Nôn ói dữ dội / Tiêu chảy ra máu (Nghi Care / Parvo)',
    keywords: ['nôn', 'ói', 'tiêu chảy', 'đi ngoài', 'ỉa chảy', 'ra máu', 'care', 'parvo', 'mất nước'],
    urgencyLevel: 'HIGH',
    badgeLabel: 'NGUY CƠ MẤT NƯỚC VÀ TRUY TIM MẠCH',
    summary: 'Nôn mửa kết hợp tiêu chảy cấp (đặc biệt ở chó mèo con chưa tiêm đủ vaccine) là dấu hiệu điển hình của virus Parvo, Care, viêm tụy cấp hoặc lồng ruột.',
    doImmediately: [
      'Cách ly thú cưng khỏi các động vật khác trong nhà để phòng ngừa lây nhiễm virus.',
      'Thu gom chất nôn/phân chụp ảnh lại màu sắc để bác sĩ xem (phân có mùi tanh khắm, lẫn máu hồng hay đen).',
      'Tạm ngừng cho ăn thức ăn đặc trong 6-12 giờ để ruột nghỉ ngơi.',
      'Kiểm tra độ đàn hồi da (kéo nhẹ da gáy lên xem có đàn hồi trở lại ngay không để biết mức độ mất nước).',
      'Đưa đến phòng khám để test nhanh virus Parvo/Care và truyền dịch qua tĩnh mạch.'
    ],
    doNotDo: [
      'KHÔNG tự ý mua thuốc Berberin, thuốc tiêu chảy của người hay kháng sinh cho uống.',
      'KHÔNG ép uống nhiều nước cùng lúc (dạ dày đang kích ứng sẽ nôn thốc ra nhiều hơn gây mất điện giải nặng hơn).'
    ],
    dangerSigns: [
      'Nôn liên tục hơn 3 lần trong 2 giờ',
      'Phân lỏng tanh nồng mùi máu cá chết',
      'Mắt trũng sâu, da gáy kéo lên không đàn hồi',
      'Lờ đờ, không đứng vững, sốt cao hoặc thân nhiệt tụt lạnh'
    ],
    nextActions: [
      { label: 'Gọi phòng khám gần nhất', actionType: 'call' },
      { label: 'Tìm phòng khám có xét nghiệm test nhanh', actionType: 'find_vet' }
    ]
  },
  {
    id: 'snake_insect_bite',
    title: 'Bị rắn / Côn trùng độc / Bọ cạp cắn',
    keywords: ['rắn', 'côn trùng', 'ong', 'ong đốt', 'rắn cắn', 'bọ cạp', 'sưng mặt'],
    urgencyLevel: 'HIGH',
    badgeLabel: 'CẦN XÁC ĐỊNH LOÀI VÀ HẠN CHẾ VẬN ĐỘNG',
    summary: 'Nọc độc của rắn hoặc sốc phản vệ do ong đốt có thể gây suy hô hấp cấp hoặc hoại tử mô nghiêm trọng.',
    doImmediately: [
      'Giữ thú cưng nằm yên tĩnh tối đa, hạn chế chạy nhảy để ngăn nọc độc phát tán theo tuần hoàn máu.',
      'Nếu an toàn, chụp ảnh con rắn/côn trùng từ xa để bác sĩ chọn đúng huyết thanh kháng nọc.',
      'Nếu bị ong đốt và thấy ngòi ong: Dùng thẻ nhựa cạo nhẹ để gạt ngòi ra (tránh bóp vào túi nọc).',
      'Rửa nhẹ nhàng vết thương bằng nước muối sinh lý hoặc xà phòng nhẹ.',
      'Đưa đến bệnh viện thú y có trữ huyết thanh càng sớm càng tốt.'
    ],
    doNotDo: [
      'TUYỆT ĐỐI KHÔNG rạch da, rạch vết cắn hoặc dùng miệng hút nọc độc.',
      'KHÔNG buộc garo quá chặt làm hoại tử chi và thiếu máu nuôi.',
      'KHÔNG đắp lá thuốc dân gian không rõ nguồn gốc lên vết thương.'
    ],
    dangerSigns: [
      'Mặt, môi, họng sưng phù nhanh chóng (nguy cơ bít đường thở)',
      'Thở rít, khò khè',
      'Chảy máu không đông từ vết cắn',
      'Yếu liệt các chi sau'
    ],
    nextActions: [
      { label: 'Gọi cấp cứu hỏi huyết thanh', actionType: 'call' },
      { label: 'Tìm bệnh viện thú y lớn', actionType: 'find_vet' }
    ]
  }
];

export function searchEmergencyCases(query: string): EmergencyCase[] {
  if (!query || !query.trim()) return EMERGENCY_CASES;
  const q = query.toLowerCase().trim();
  
  return EMERGENCY_CASES.filter((item) => {
    return (
      item.title.toLowerCase().includes(q) ||
      item.summary.toLowerCase().includes(q) ||
      item.keywords.some((k) => k.toLowerCase().includes(q) || q.includes(k.toLowerCase())) ||
      item.dangerSigns.some((d) => d.toLowerCase().includes(q))
    );
  });
}
