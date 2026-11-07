import mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/petcare';

async function seed() {
  console.log('🌱 Starting PetCare database seeding...');
  console.log(`Connecting to: ${MONGODB_URI}`);

  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection;

  // Clear existing collections if they exist
  const collections = await db.db!.listCollections().toArray();
  const collectionNames = collections.map((c) => c.name);
  console.log(`Existing collections: ${collectionNames.join(', ') || 'none'}`);

  for (const name of collectionNames) {
    await db.collection(name).deleteMany({});
  }
  console.log('🧹 Cleaned existing database collections');

  // 1. Users
  const passwordHashUser = await bcrypt.hash('Password123!', 10);
  const passwordHashAdmin = await bcrypt.hash('AdminPass123!', 10);

  const userResult = await db.collection('users').insertOne({
    name: 'Nguyễn Văn Minh',
    email: 'user@petcare.vn',
    passwordHash: passwordHashUser,
    phone: '0901234567',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  const userId = userResult.insertedId;

  const adminResult = await db.collection('users').insertOne({
    name: 'PetCare Bác sĩ Quản trị',
    email: 'admin@petcare.vn',
    passwordHash: passwordHashAdmin,
    phone: '0987654321',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  const adminId = adminResult.insertedId;

  console.log('✅ Created demo users: user@petcare.vn & admin@petcare.vn');

  // 2. Pets
  const miloResult = await db.collection('pets').insertOne({
    userId: userId,
    name: 'Milo',
    species: 'dog',
    breed: 'Golden Retriever',
    gender: 'male',
    birthDate: '2022-03-15',
    weight: 24.5,
    microchipId: 'VN-982000412091',
    avatar: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80',
    allergies: ['Thịt bò'],
    chronicConditions: [],
    isSpayedNeutered: true,
    notes: 'Rất thân thiện, năng động, thích bơi lội và chạy nhảy ngoài công viên',
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  const miloId = miloResult.insertedId;

  const lunaResult = await db.collection('pets').insertOne({
    userId: userId,
    name: 'Luna',
    species: 'cat',
    breed: 'British Shorthair (Mèo Anh Lông Ngắn)',
    gender: 'female',
    birthDate: '2023-01-10',
    weight: 4.2,
    microchipId: 'VN-982000588123',
    avatar: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80',
    allergies: [],
    chronicConditions: ['Nhạy cảm đường tiêu hóa'],
    isSpayedNeutered: true,
    notes: 'Khá điềm tĩnh, thích nằm sưởi nắng cửa sổ và ăn pate cá hồi',
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  const lunaId = lunaResult.insertedId;

  console.log('✅ Created demo pets: Milo (Dog) & Luna (Cat)');

  // 3. Growth & Weight Records
  await db.collection('weightrecords').insertMany([
    { petId: miloId, weight: 4.5, recordedAt: new Date('2022-05-15'), notes: 'Cân lúc 2 tháng tuổi', createdAt: new Date(), updatedAt: new Date() },
    { petId: miloId, weight: 12.0, recordedAt: new Date('2022-07-15'), notes: 'Cân lúc 4 tháng tuổi', createdAt: new Date(), updatedAt: new Date() },
    { petId: miloId, weight: 18.2, recordedAt: new Date('2022-09-15'), notes: 'Cân lúc 6 tháng tuổi', createdAt: new Date(), updatedAt: new Date() },
    { petId: miloId, weight: 24.5, recordedAt: new Date('2023-03-15'), notes: 'Cân lúc tròn 1 tuổi', createdAt: new Date(), updatedAt: new Date() },
    { petId: lunaId, weight: 1.2, recordedAt: new Date('2023-04-10'), notes: 'Cân lúc 3 tháng tuổi', createdAt: new Date(), updatedAt: new Date() },
    { petId: lunaId, weight: 2.8, recordedAt: new Date('2023-07-10'), notes: 'Cân lúc 6 tháng tuổi', createdAt: new Date(), updatedAt: new Date() },
    { petId: lunaId, weight: 4.2, recordedAt: new Date('2024-01-10'), notes: 'Cân lúc tròn 1 tuổi', createdAt: new Date(), updatedAt: new Date() },
  ]);

  // 4. Growth Photos Timeline
  await db.collection('petphotos').insertMany([
    {
      petId: miloId,
      photoUrl: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=600&q=80',
      caption: 'Milo ngày đầu về nhà mới - tròn 2 tháng tuổi',
      date: new Date('2022-05-15'),
      tag: 'baby',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      petId: miloId,
      photoUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80',
      caption: 'Milo tròn 1 tuổi khỏe mạnh và thông minh',
      date: new Date('2023-03-15'),
      tag: 'current',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  // 5. Health Records
  await db.collection('healthrecords').insertMany([
    {
      petId: miloId,
      type: 'vaccine',
      title: 'Tiêm phòng Vaccine dại (Rabies)',
      date: '2024-03-10',
      clinicName: 'Bệnh viện thú y Samyang TP.HCM',
      veterinarian: 'BS. Lê Hoài Nam',
      notes: 'Thú cưng bình thường sau tiêm, không sốt, ăn uống tốt.',
      cost: 250000,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      petId: miloId,
      type: 'deworming',
      title: 'Tẩy giun định kỳ',
      date: '2024-05-01',
      clinicName: 'Phòng khám thú y PetCare',
      veterinarian: 'BS. Trần Mai',
      notes: 'Dùng viên uống Endogard theo cân nặng',
      cost: 120000,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      petId: lunaId,
      type: 'checkup',
      title: 'Khám sức khỏe tổng quát và siêu âm tiêu hóa',
      date: '2024-06-15',
      clinicName: 'Phòng khám thú y PetPro',
      veterinarian: 'BS. Phạm Tuấn',
      diagnosis: 'Hệ tiêu hóa ổn định, chỉ cần bổ sung men vi sinh probiotic',
      prescription: 'Men tiêu hóa Benefiber 1 gói/ngày x 7 ngày',
      cost: 450000,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  // 6. Vaccinations
  const nextDueDate = new Date();
  nextDueDate.setDate(nextDueDate.getDate() + 15);

  await db.collection('vaccinations').insertMany([
    {
      petId: miloId,
      name: 'Vaccine 7 bệnh cho chó (Canine Distemper, Parvo, Hepatitis, Adeno, Corona, Para, Lepto)',
      dateAdministered: new Date('2023-09-20'),
      nextDueDate: nextDueDate,
      batchNumber: 'V7-2023-8891',
      clinic: 'Bệnh viện Thú Y Samyang',
      notes: 'Mũi tiêm nhắc lại hàng năm',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      petId: lunaId,
      name: 'Vaccine 4 bệnh cho mèo (Purevax Feline 4)',
      dateAdministered: new Date('2024-01-15'),
      nextDueDate: new Date('2025-01-15'),
      batchNumber: 'PV4-9921',
      clinic: 'PetCare Clinic',
      notes: 'Mũi thường niên đạt chuẩn',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  // 7. Medications
  await db.collection('medications').insertMany([
    {
      petId: miloId,
      name: 'NexGard Spectra (Ngoại & nội ký sinh trùng)',
      dosage: '1 viên nhai 15-30kg',
      frequency: 'Mỗi tháng 1 lần',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      notes: 'Cho nhai cùng thức ăn buổi sáng',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      petId: lunaId,
      name: 'Probiotic Vetomune Men Vi Sinh',
      dosage: '1/2 gói pha nước ấm',
      frequency: 'Mỗi ngày 1 lần vào buổi tối',
      startDate: new Date('2024-06-15'),
      endDate: new Date('2024-06-25'),
      notes: 'Uống sau bữa ăn tối 30 phút',
      isActive: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  // 8. Reminders
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(9, 0, 0, 0);

  const inFiveDays = new Date();
  inFiveDays.setDate(inFiveDays.getDate() + 5);
  inFiveDays.setHours(14, 0, 0, 0);

  await db.collection('reminders').insertMany([
    {
      petId: miloId,
      title: 'Uống viên phòng ve rận NexGard Spectra',
      type: 'medication',
      dueDate: tomorrow,
      time: '09:00',
      recurring: 'monthly',
      status: 'pending',
      notes: 'Nhớ cho ăn no trước khi cho uống thuốc',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      petId: miloId,
      title: 'Tắm spa cắt tỉa lông Milo',
      type: 'grooming',
      dueDate: inFiveDays,
      time: '14:00',
      recurring: 'none',
      status: 'pending',
      notes: 'Đặt hẹn tại Pet Mart Ba Tháng Hai',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      petId: lunaId,
      title: 'Tẩy giun định kỳ cho Luna',
      type: 'deworming',
      dueDate: nextDueDate,
      time: '10:00',
      recurring: 'monthly',
      status: 'pending',
      notes: 'Dùng thuốc nhỏ gáy Revolution',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  // 9. Veterinary Clinics and Pet Stores (Locations)
  await db.collection('locations').insertMany([
    {
      name: 'Bệnh Viện Thú Y PetCare Quận 2 (Cấp Cứu 24/7)',
      type: 'clinic',
      address: '124A Xuân Thủy, P. Thảo Điền, TP. Thủ Đức, TP. Hồ Chí Minh',
      lat: 10.8034,
      lng: 106.7328,
      phone: '028 3744 2505',
      emergencyPhone: '0918 271 247',
      isEmergency24h: true,
      rating: 4.8,
      reviewCount: 342,
      services: ['Cấp cứu 24/7', 'Phẫu thuật ngoại khoa', 'Nội trú cao cấp', 'Chụp X-quang kỹ thuật số', 'Siêu âm Doppler màu'],
      description: 'Bệnh viện thú y tiêu chuẩn quốc tế tại Thảo Điền với đầy đủ trang thiết bị cấp cứu và đội ngũ bác sĩ chuyên khoa túc trực 24/7.',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Bệnh Viện Thú Y Samyang Pet Hospital Quận 7',
      type: 'clinic',
      address: 'Khu Đô Thị Phú Mỹ Hưng, Đường Nguyễn Đức Cảnh, P. Tân Phong, Quận 7, TP. Hồ Chí Minh',
      lat: 10.7291,
      lng: 106.7058,
      phone: '028 5410 7999',
      emergencyPhone: '0903 999 888',
      isEmergency24h: true,
      rating: 4.9,
      reviewCount: 512,
      services: ['Cấp cứu 24/7', 'Xét nghiệm máu tự động', 'Nha khoa thú cưng', 'Điều trị nội trú', 'Khách sạn thú cưng'],
      description: 'Hệ thống bệnh viện thú y uy tín hàng đầu với đội ngũ chuyên gia tận tâm, phòng mổ vô trùng áp lực dương hiện đại.',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Bệnh Viện Thú Y PetPro Tân Bình',
      type: 'clinic',
      address: '387 Cộng Hòa, Phường 13, Quận Tân Bình, TP. Hồ Chí Minh',
      lat: 10.8021,
      lng: 106.6432,
      phone: '028 3810 4125',
      emergencyPhone: '0913 949 041',
      isEmergency24h: true,
      rating: 4.7,
      reviewCount: 289,
      services: ['Khám tổng quát', 'Tiêm phòng vaccine', 'Cấp cứu ban đêm', 'Triệt sản an toàn'],
      description: 'Cơ sở thú y lâu năm đáng tin cậy khu vực Tân Bình, Tân Phú với trang thiết bị đầy đủ.',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Siêu Thị Thú Cưng Pet Mart Ba Tháng Hai',
      type: 'store',
      address: '116 Đường 3 Tháng 2, Phường 12, Quận 10, TP. Hồ Chí Minh',
      lat: 10.7725,
      lng: 106.6775,
      phone: '028 7106 9906',
      isEmergency24h: false,
      rating: 4.6,
      reviewCount: 420,
      services: ['Cửa hàng thức ăn & phụ kiện', 'Spa & Tắm cắt tỉa lông', 'Khách sạn thú cưng'],
      description: 'Siêu thị bán lẻ đồ dùng thú cưng chính hãng hàng đầu Việt Nam: Royal Canin, Taste of the Wild, Orijen, phụ kiện đồ chơi.',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'PetCity - Chuỗi Cửa Hàng Thú Cưng Thảo Điền',
      type: 'store',
      address: '55 Thảo Điền, P. Thảo Điền, TP. Thủ Đức, TP. Hồ Chí Minh',
      lat: 10.8062,
      lng: 106.7351,
      phone: '028 3519 2268',
      isEmergency24h: false,
      rating: 4.5,
      reviewCount: 198,
      services: ['Thức ăn hạt cao cấp', 'Thuốc thú y không kê đơn', 'Đồ chơi và chuồng nệm'],
      description: 'Cung cấp thức ăn nhập khẩu cao cấp, các loại hạt dinh dưỡng, pate và quần áo thú cưng.',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  // 10. Knowledge Articles
  await db.collection('knowledgearticles').insertMany([
    {
      title: 'Nhận biết và xử lý khẩn cấp khi chó mèo bị sốc nhiệt (Heatstroke)',
      slug: 'nhan-biet-va-xu-ly-soc-nhiet-cho-meo',
      category: 'emergency',
      targetSpecies: ['dog', 'cat'],
      summary: 'Sốc nhiệt là tình trạng cấp cứu nguy hiểm tính mạng thú cưng trong mùa nóng. Tìm hiểu ngay các bước hạ nhiệt an toàn.',
      content: `## Sốc nhiệt là gì?
Sốc nhiệt xảy ra khi thân nhiệt của thú cưng vượt quá 40°C do không thể tự thoát nhiệt hiệu quả (chó và mèo chỉ thoát nhiệt qua hơi thở hổn hển và đệm bàn chân).

## Dấu hiệu nhận biết
- Thở dốc, thở hổn hển liên tục và dữ dội.
- Lưỡi và nướu đỏ rực hoặc tím tái.
- Chảy nhiều nước dãi sủi bọt.
- Đi đứng lảo đảo, run rẩy, co giật hoặc ngất xỉu.

## Cách sơ cứu đúng chuẩn:
1. Đưa thú cưng vào ngay nơi râm mát hoặc phòng có điều hòa/quạt nhẹ.
2. Dùng khăn thấm nước mát (nước máy bình thường) lau vùng bụng, bẹn, nách và lòng bàn chân.
3. KHÔNG DÙNG NƯỚC ĐÁ LẠNH vì sẽ làm co mạch máu ngoại vi, giữ nhiệt trong nội tạng nguy hiểm hơn.
4. Cho uống từng ngụm nước nhỏ nếu còn tỉnh táo.
5. Vận chuyển ngay đến phòng khám thú y gần nhất.`,
      tags: ['sốc nhiệt', 'sơ cứu', 'mùa hè', 'cấp cứu'],
      views: 1250,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: 'Top 10 thực phẩm quen thuộc của người nhưng cực kỳ độc hại với thú cưng',
      slug: 'top-10-thuc-pham-doc-hai-voi-thu-cung',
      category: 'nutrition',
      targetSpecies: ['dog', 'cat'],
      summary: 'Sô-cô-la, hành tỏi, nho khô, chất tạo ngọt Xylitol... có thể gây suy thận cấp hoặc ngộ độc chết người.',
      content: `Nhiều loại thực phẩm hàng ngày của con người lại là độc dược đối với chó mèo:

1. **Sô-cô-la (Chocolate):** Chứa theobromine và caffeine gây loạn nhịp tim, co giật và tử vong.
2. **Nho tươi và nho khô:** Gây suy thận cấp không hồi phục ở chó, ngay cả với lượng rất nhỏ.
3. **Hành tây, tỏi và hẹ:** Phá hủy hồng cầu, gây thiếu máu tán huyết nghiêm trọng.
4. **Chất ngọt Xylitol (trong kẹo cao su, bơ đậu phộng ăn kiêng):** Khiến lượng đường huyết tụt đột ngột và gây suy gan cấp tính.
5. **Cà phê, trà và đồ uống có gas:** Chứa nồng độ caffeine cao kích thích hệ thần kinh trung ương quá mức.`,
      tags: ['dinh dưỡng', 'ngộ độc', 'an toàn', 'thức ăn nguy hiểm'],
      views: 2480,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: 'Lịch tiêm phòng vắc-xin chuẩn y khoa cho chó mèo từ 2 tháng tuổi',
      slug: 'lich-tiem-phong-chuan-y-khoa',
      category: 'health',
      targetSpecies: ['dog', 'cat'],
      summary: 'Hướng dẫn đầy đủ phác đồ tiêm phòng mũi 1, mũi 2, mũi 3 và tiêm nhắc dại hàng năm để bảo vệ thú cưng toàn diện.',
      content: `## Đối với chó con:
- **6-8 tuần tuổi:** Mũi 1 (Vaccine 5 bệnh: Care, Parvo, Viêm gan, Ho cũi, Cúm).
- **9-11 tuần tuổi:** Mũi 2 (Vaccine 7 bệnh: thêm Leptospira và Coronavirus).
- **12-14 tuần tuổi:** Mũi 3 (Vaccine 7 bệnh nhắc lại).
- **Từ 3 tháng tuổi trở lên:** Tiêm phòng bệnh Dại (Rabies) bắt buộc theo quy định pháp luật.
- **Sau đó:** Nhắc lại vaccine tổng hợp và vắc-xin dại mỗi năm 1 lần.

## Đối với mèo con:
- **8 tuần tuổi:** Mũi 1 (Vaccine 4 bệnh mèo: Giảm bạch cầu FPV, Viêm mũi FVR, Calicivirus, Chlamydia).
- **12 tuần tuổi:** Mũi 2 nhắc lại.
- **16 tuần tuổi:** Mũi 3 và Vaccine dại.`,
      tags: ['tiêm phòng', 'vắc xin', 'sức khỏe', 'bác sĩ thú y'],
      views: 3100,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  // 11. Instructional Videos
  await db.collection('videos').insertMany([
    {
      title: 'Hướng dẫn sơ cứu khi thú cưng bị nghẹn hoặc hóc dị vật',
      description: 'Bác sĩ thú y hướng dẫn kỹ thuật vỗ lưng và nghiệm pháp Heimlich an toàn dành riêng cho chó mèo.',
      youtubeId: 'W34zT3J3rB8',
      videoUrl: 'https://www.youtube.com/watch?v=W34zT3J3rB8',
      thumbnailUrl: 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?auto=format&fit=crop&w=600&q=80',
      duration: '4:35',
      category: 'emergency',
      targetSpecies: ['dog', 'cat'],
      views: 5320,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: 'Cách cắt móng cho cún cưng không làm chảy máu tủy móng',
      description: 'Bí quyết nhận biết phần tủy hồng bên trong móng và cách dùng kềm cắt móng thú cưng chuẩn xác, nhẹ nhàng.',
      youtubeId: 'M7lc1UVf-VE',
      videoUrl: 'https://www.youtube.com/watch?v=M7lc1UVf-VE',
      thumbnailUrl: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=600&q=80',
      duration: '6:12',
      category: 'care',
      targetSpecies: ['dog'],
      views: 8910,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  // 12. Community Blog & Video Posts
  const post1 = await db.collection('communityposts').insertOne({
    authorId: adminId,
    title: 'Cách cắt móng cho cún cưng an toàn không phạm vào tủy máu',
    content: 'Bác sĩ thú y hướng dẫn kỹ thuật quan sát đường viền tủy hồng bên trong móng vuốt và cách dùng kềm cắt chuẩn xác 45 độ, giúp cún không bị hoảng sợ hay đau đớn khi cắt tỉa tại nhà.',
    category: 'Chăm sóc chó',
    postType: 'video',
    videoUrl: 'https://www.youtube.com/watch?v=M7lc1UVf-VE',
    youtubeId: 'M7lc1UVf-VE',
    imageUrl: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=600&q=80',
    images: ['https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=600&q=80'],
    tags: ['cắt móng', 'chăm sóc', 'video hướng dẫn', 'vệ sinh'],
    isVerifiedByDoctor: true,
    isPinned: true,
    likeCount: 42,
    commentCount: 3,
    status: 'PUBLISHED',
    createdAt: new Date(Date.now() - 3600000 * 24),
    updatedAt: new Date(),
  });

  const post2 = await db.collection('communityposts').insertOne({
    authorId: adminId,
    title: 'Kỹ thuật sơ cứu khẩn cấp khi chó mèo bị nghẹn hoặc hóc dị vật',
    content: 'Hướng dẫn trực quan nghiệm pháp vỗ lưng và thủ thuật Heimlich thú y để tống xuất dị vật (xương, bóng, đồ chơi cao su) khỏi khí quản trong 3 phút vàng trước khi chuyển tới phòng cấp cứu.',
    category: 'Sức khỏe',
    postType: 'video',
    videoUrl: 'https://www.youtube.com/watch?v=W34zT3J3rB8',
    youtubeId: 'W34zT3J3rB8',
    imageUrl: 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?auto=format&fit=crop&w=600&q=80',
    images: ['https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?auto=format&fit=crop&w=600&q=80'],
    tags: ['sơ cứu', 'hóc dị vật', 'cấp cứu thú y', 'video'],
    isVerifiedByDoctor: true,
    isPinned: true,
    likeCount: 68,
    commentCount: 5,
    status: 'PUBLISHED',
    createdAt: new Date(Date.now() - 3600000 * 48),
    updatedAt: new Date(),
  });

  const post3 = await db.collection('communityposts').insertOne({
    authorId: userId,
    title: 'Kinh nghiệm chọn hạt dinh dưỡng cho chó lông vàng không bị ố khóe mắt',
    content: 'Chào cả nhà, trước đây Milo nhà mình bị chảy nước mắt ố vàng khá nhiều quanh mắt. Sau khi đổi sang dòng hạt không ngũ cốc (Grain-Free) kết hợp lau khăn ẩm nước muối sinh lý mỗi sáng thì trộm vía khóe mắt sạch hẳn. Mọi người có bé nào bị tương tự có thể tham khảo nhé!',
    category: 'Kinh nghiệm thực tế',
    postType: 'article',
    imageUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80',
    images: ['https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80'],
    tags: ['golden retriever', 'dinh dưỡng', 'chăm sóc lông'],
    isVerifiedByDoctor: false,
    isPinned: false,
    likeCount: 23,
    commentCount: 2,
    status: 'PUBLISHED',
    createdAt: new Date(Date.now() - 3600000 * 12),
    updatedAt: new Date(),
  });

  await db.collection('comments').insertMany([
    {
      postId: post3.insertedId,
      authorId: adminId,
      content: 'Chia sẻ rất hữu ích! Chế độ ăn ít ngũ cốc gluten và bổ sung axit béo Omega-3 giúp giảm viêm tuyến lệ rất rõ rệt ở các giống chó lông sáng màu.',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      postId: post1.insertedId,
      authorId: userId,
      content: 'Video hướng dẫn rất dễ hiểu, mình vừa áp dụng thành công cho bé Milo nhà mình xong!',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  // 13. Notifications
  await db.collection('notifications').insertMany([
    {
      userId: userId,
      title: 'Nhắc lịch uống thuốc định kỳ',
      message: 'Đến hẹn uống viên phòng ngừa ve rận NexGard Spectra cho Milo ngày mai.',
      type: 'reminder',
      read: false,
      link: '/reminders',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      userId: userId,
      title: 'Lịch tiêm phòng sắp đến hạn',
      message: 'Milo còn 15 ngày nữa là đến hẹn tiêm nhắc vắc-xin 7 bệnh.',
      type: 'vaccine',
      read: false,
      link: '/vaccinations',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  console.log('✨ Seed completed successfully! All 17 collections populated with rich realistic Vietnamese demo data.');
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Error during seeding:', err);
  process.exit(1);
});
