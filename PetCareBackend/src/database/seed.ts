import mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/petcare';

async function seed() {
  console.log('🌱 [WBS 4.1.1] Starting database seed for Core Schemas: Users, Pets, Clinics...');
  console.log(`Connecting to: ${MONGODB_URI}`);

  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection;

  // 1. Clear core collections
  const coreCollections = ['users', 'pets', 'locations'];
  for (const name of coreCollections) {
    try {
      await db.collection(name).deleteMany({});
    } catch {
      // Collection may not exist yet
    }
  }
  console.log('🧹 Cleaned existing core collections');

  // 2. Seed Users
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
  console.log('✅ 1. Seeded Users collection (user@petcare.vn & admin@petcare.vn)');

  // 3. Seed Pets
  await db.collection('pets').insertMany([
    {
      ownerId: userId,
      name: 'Milo',
      species: 'dog',
      breed: 'Golden Retriever',
      gender: 'male',
      birthDate: '2022-03-15',
      estimatedAge: '2 tuổi 6 tháng',
      weight: 28.5,
      coatColor: 'Vàng kim',
      avatar: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80',
      microchip: 'PET-VN-2022-0089',
      isNeutered: true,
      allergies: ['Thịt bò'],
      specialNotes: 'Bé rất thích đi dạo bờ hồ, ngoan ngoãn',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      ownerId: userId,
      name: 'Luna',
      species: 'cat',
      breed: 'Mèo Anh Lông Ngắn',
      gender: 'female',
      birthDate: '2023-01-10',
      estimatedAge: '1 tuổi 8 tháng',
      weight: 4.2,
      coatColor: 'Xám xanh',
      avatar: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80',
      isNeutered: true,
      allergies: [],
      specialNotes: 'Khá nhút nhát với người lạ',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
  console.log('✅ 2. Seeded Pets collection (Milo & Luna)');

  // 4. Seed Clinics / Locations
  await db.collection('locations').insertMany([
    {
      name: 'Bệnh Viện Thú Y 24/7 PetCare Đống Đa',
      address: '124 Hoàng Cầu, Ô Chợ Dừa, Đống Đa, Hà Nội',
      phone: '024 3857 9999',
      hotline: '0988 123 456',
      type: 'VET_HOSPITAL',
      latitude: 21.0182,
      longitude: 105.8234,
      isOpen247: true,
      rating: 4.9,
      reviewCount: 328,
      services: ['Cấp cứu 24/7', 'Phẫu thuật ngoại khoa', 'Xét nghiệm máu', 'Chụp X-quang', 'Nội trú'],
      description: 'Trung tâm cấp cứu thú cưng trang bị phòng mổ áp lực dương và máy thở ICU.',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Phòng Khám Thú Y Cầu Giấy Vet Clinic',
      address: '86 Trần Thái Tông, Dịch Vọng Hậu, Cầu Giấy, Hà Nội',
      phone: '024 6688 2244',
      type: 'VET_CLINIC',
      latitude: 21.0335,
      longitude: 105.7891,
      isOpen247: false,
      rating: 4.7,
      reviewCount: 195,
      services: ['Khám tổng quát', 'Tiêm phòng vaccine', 'Triệt sản an toàn', 'Điều trị da liễu'],
      description: 'Phòng khám chuyên khoa nội nhi thú cảnh và tư vấn dinh dưỡng.',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Trạm Xá Cấp Cứu Thú Y Đà Nẵng 24/7',
      address: '45 Nguyễn Văn Linh, Nam Dương, Hải Châu, Đà Nẵng',
      phone: '0236 3899 999',
      hotline: '0905 111 222',
      type: 'VET_HOSPITAL',
      latitude: 16.0602,
      longitude: 108.2163,
      isOpen247: true,
      rating: 4.8,
      reviewCount: 210,
      services: ['Cấp cứu 24/7', 'Phẫu thuật', 'Xét nghiệm sinh hóa', 'Nội trú theo dõi'],
      description: 'Bệnh viện thú y đa khoa hàng đầu miền Trung trực cấp cứu xuyên đêm.',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
  console.log('✅ 3. Seeded Locations/Clinics collection (3 trạm xá thú y 24/7 & phòng khám)');

  console.log('🎉 [WBS 4.1.1] Core database seed completed successfully!');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
