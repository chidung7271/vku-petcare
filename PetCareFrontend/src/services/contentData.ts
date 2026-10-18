import { KnowledgeArticle, CareVideo } from '../types';

export const KNOWLEDGE_ARTICLES: KnowledgeArticle[] = [
  {
    id: 'kb_1',
    title: 'Cẩm nang dinh dưỡng: Những thực phẩm gây tử vong cho Chó & Mèo',
    category: 'Dinh dưỡng',
    readTime: '4 phút đọc',
    summary: 'Danh sách 10 loại thực phẩm phổ biến trong bếp người nhưng là độc dược nguy hiểm với thú cưng mà chủ nuôi tuyệt đối không được cho ăn.',
    warning: 'Nếu thú cưng vừa ăn phải các thực phẩm này, liên hệ ngay cơ sở thú y gần nhất.',
    source: 'Hội Thú Y Động Vật Nhỏ Thế Giới (WSAVA)',
    updatedAt: '10/09/2026',
    content: [
      '1. Chocolate và Cacao: Chứa chất Theobromine làm tim đập nhanh, co giật và suy tim cấp.',
      '2. Nho tươi & Nho khô: Dù chỉ 1-2 quả cũng có thể gây suy thận cấp không hồi phục ở chó.',
      '3. Hành, Tỏi, Hẹ: Phá hủy hồng cầu, gây thiếu máu tan máu trầm trọng (Heinz body anemia).',
      '4. Chất làm ngọt Xylitol (trong kẹo cao su, bơ đậu phộng không đường): Khiến tụt đường huyết đột ngột và suy gan cấp.',
      '5. Quả bơ (Avocado): Chứa Persin gây khó thở, tích tụ dịch ở ngực và bụng.',
      '6. Xương nấu chín: Khi nấu chín, xương trở nên giòn và dễ vỡ vụn thành các mảnh sắc như dao cạo đâm thủng dạ dày, ruột.'
    ]
  },
  {
    id: 'kb_2',
    title: 'Lịch tiêm phòng Vaccine chuẩn quốc tế cho Chó và Mèo',
    category: 'Vaccine',
    readTime: '5 phút đọc',
    summary: 'Hướng dẫn chi tiết từng mũi tiêm từ lúc sơ sinh đến khi trưởng thành giúp tạo lá chắn miễn dịch vững chắc.',
    source: 'Hiệp Hội Bác Sĩ Thú Y Hoa Kỳ (AAHA)',
    updatedAt: '05/09/2026',
    content: [
      '• Lịch tiêm cho Chó:',
      '  - Mũi 1 (6-8 tuần): Vaccine phòng 5 hoặc 6 bệnh (Parvo, Care, Viêm gan truyền nhiễm, Ho cũi chó, Cúm).',
      '  - Mũi 2 (10-12 tuần): Vaccine 7 bệnh (bổ sung Leptospira).',
      '  - Mũi 3 (14-16 tuần): Mũi nhắc lại 7 bệnh.',
      '  - Mũi Dại: Tiêm lúc 12-16 tuần tuổi.',
      '  - Tiêm nhắc lại: Mỗi năm 1 lần gồm 1 mũi 7 bệnh + 1 mũi dại.',
      '• Lịch tiêm cho Mèo:',
      '  - Mũi 1 (8 tuần): Vaccine 3 hoặc 4 bệnh (Giảm bạch cầu, Viêm mũi khí quản, Calicivirus).',
      '  - Mũi 2 (12 tuần): Mũi nhắc lại.',
      '  - Mũi Dại: Tiêm lúc 12 tuần tuổi trở lên.',
      '  - Tiêm nhắc lại: Mỗi năm 1 lần.'
    ]
  },
  {
    id: 'kb_3',
    title: 'Nhận biết 7 dấu hiệu "Báo động đỏ" cần đưa thú cưng đi cấp cứu',
    category: 'Dấu hiệu cần đi khám',
    readTime: '3 phút đọc',
    summary: 'Đừng chần chừ! Khi xuất hiện bất kỳ dấu hiệu nào sau đây, bạn cần đưa bé đến bác sĩ ngay lập tức.',
    warning: 'Thời gian vàng cứu sống thú cưng phụ thuộc vào phản ứng nhanh của chủ nuôi.',
    source: 'Khoa Cấp Cứu Thú Y Bệnh Viện PetCare',
    updatedAt: '01/09/2026',
    content: [
      '1. Khó thở, thở há mõm hổn hển (đặc biệt ở mèo) hoặc nướu tím tái.',
      '2. Chảy máu không cầm được từ mũi, miệng hoặc vết thương hở.',
      '3. Co giật kéo dài trên 3 phút hoặc ngất lịm không tỉnh.',
      '4. Bí tiểu hoặc rặn tiểu đau đớn kêu la (cực kỳ nguy hiểm ở mèo đực do tắc niệu đạo).',
      '5. Nôn mửa hoặc tiêu chảy lẫn máu tươi, phân tanh khắm.',
      '6. Bụng chướng to đột ngột và nôn khan liên tục (dấu hiệu xoắn dạ dày cấp GDV ở chó lớn).',
      '7. Liệt hai chân sau đột ngột hoặc kêu la dữ dội khi chạm vào cơ thể.'
    ]
  },
  {
    id: 'kb_4',
    title: 'Kỹ năng sơ cứu ban đầu khi thú cưng bị bỏng nước sôi hoặc điện giật',
    category: 'Sơ cứu',
    readTime: '4 phút đọc',
    summary: 'Các bước xử trí đúng cách trong 5 phút đầu tiên giúp giảm thiểu tổn thương da và sốc thần kinh.',
    source: 'Red Cross Pet First Aid Standards',
    updatedAt: '28/08/2026',
    content: [
      '• Khi bị bỏng nước sôi / dầu mỡ:',
      '  - Xả nhẹ nhàng nước mát sạch (nhiệt độ phòng) lên vùng bỏng trong 10-15 phút để hạ nhiệt.',
      '  - KHÔNG chườm đá lạnh trực tiếp (gây bỏng lạnh phá hủy mô thêm).',
      '  - KHÔNG bôi kem đánh răng, mỡ trăn hay nước mắm lên vết bỏng.',
      '  - Che phủ nhẹ vết bỏng bằng gạc ẩm vô trùng và đưa đi viện.',
      '• Khi bị điện giật:',
      '  - NGẮT NGUỒN ĐIỆN trước khi chạm vào thú cưng!',
      '  - Kiểm tra nhịp thở và tim đập.',
      '  - Đề phòng phù phổi cấp do dòng điện gây co thắt khí quản.'
    ]
  }
];

export const CARE_VIDEOS: CareVideo[] = [
  {
    id: 'vid_1',
    title: 'Hướng dẫn cắt móng an toàn - Không bao giờ phạm tủy máu',
    duration: '04:15',
    category: 'Grooming',
    level: 'Cơ bản',
    description: 'Cách xác định đường tủy (quick), góc đặt kìm cắt chuẩn 45 độ và mẹo xử lý bằng bột cầm máu nếu lỡ cắt phạm.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=600&q=80',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  },
  {
    id: 'vid_2',
    title: 'Thao tác sơ cứu Heimlich khi Chó Mèo bị hóc dị vật',
    duration: '03:30',
    category: 'Sơ cứu cơ bản',
    level: 'Trung bình',
    description: 'Bác sĩ thú y trực tiếp làm mẫu động tác đẩy cơ hoành (Heimlich) giúp tống dị vật ra ngoài trong tình huống nghẹt thở khẩn cấp.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=600&q=80',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  },
  {
    id: 'vid_3',
    title: 'Bí quyết cho chó mèo uống thuốc viên chỉ trong 5 giây',
    duration: '02:45',
    category: 'Chăm sóc y tế',
    level: 'Cơ bản',
    description: 'Không cần vật lộn: 3 kỹ thuật cho uống thuốc bằng thanh đẩy thuốc hoặc bọc thức ăn ngon mà thú cưng không nhận ra.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=600&q=80',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  },
  {
    id: 'vid_4',
    title: 'Quy trình vệ sinh tai sạch sẽ phòng ngừa viêm tai nấm',
    duration: '05:10',
    category: 'Vệ sinh tai',
    level: 'Cơ bản',
    description: 'Cách dùng dung dịch rửa tai chuyên dụng, massage gốc tai tạo tiếng "xoẹt xoẹt" và lau khô vành tai an toàn.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=600&q=80',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  },
  {
    id: 'vid_5',
    title: 'Tập đánh răng cho cún và mèo chống hôi miệng và cao răng',
    duration: '06:20',
    category: 'Đánh răng',
    level: 'Trung bình',
    description: 'Lộ trình 7 ngày làm quen với bàn chải ngón tay và kem đánh răng enzyme vị gà thơm ngon.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  }
];
