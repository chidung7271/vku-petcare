import { 
  Pet, 
  HealthRecord, 
  WeightRecord, 
  PetPhoto, 
  Reminder, 
  LostPetReport, 
  CommunityPost, 
  UserProfile 
} from '../types';

const STORAGE_KEYS = {
  PETS: 'petcare_pets',
  ACTIVE_PET_ID: 'petcare_active_pet_id',
  HEALTH_RECORDS: 'petcare_health_records',
  WEIGHT_RECORDS: 'petcare_weight_records',
  PHOTOS: 'petcare_photos',
  REMINDERS: 'petcare_reminders',
  LOST_PETS: 'petcare_lost_pets',
  POSTS: 'petcare_posts',
  USER: 'petcare_user',
  THEME: 'petcare_theme',
  ONBOARDED: 'petcare_onboarded'
};

// Initial Rich Demo Data
const INITIAL_PETS: Pet[] = [
  {
    id: 'pet_milo',
    name: 'Milo',
    species: 'dog',
    breed: 'Golden Retriever',
    gender: 'male',
    birthDate: '2023-04-15',
    estimatedAge: '2 tuổi 5 tháng',
    weight: 28.5,
    coatColor: 'Vàng kem óng',
    avatar: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80',
    microchip: 'VN-982000345612',
    isNeutered: true,
    allergies: ['Dị ứng thịt bò nhẹ', 'Bụi phấn hoa'],
    chronicConditions: ['Viêm da dị ứng nhẹ mùa mưa'],
    currentMedications: ['NexGard Spectra hàng tháng'],
    preferredVet: 'Bệnh viện Thú y PetHealth - BS. Minh Đức',
    createdAt: '2023-05-01T08:00:00.000Z'
  },
  {
    id: 'pet_luna',
    name: 'Luna',
    species: 'cat',
    breed: 'Mèo Anh Lông Ngắn',
    gender: 'female',
    birthDate: '2024-01-10',
    estimatedAge: '1 tuổi 8 tháng',
    weight: 4.2,
    coatColor: 'Xám xanh (Blue Solid)',
    avatar: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80',
    microchip: 'VN-982000998822',
    isNeutered: true,
    allergies: [],
    chronicConditions: [],
    currentMedications: ['Bổ sung Taurine dạng gel'],
    preferredVet: 'Phòng khám Thú y V-Pet - BS. Hương Giang',
    createdAt: '2024-02-15T09:30:00.000Z'
  }
];

const INITIAL_HEALTH_RECORDS: HealthRecord[] = [
  {
    id: 'hr_1',
    petId: 'pet_milo',
    type: 'vaccine',
    title: 'Tiêm phòng Vaccine 7 bệnh Nobivac DHPPI+L',
    date: '2026-04-10',
    nextDueDate: '2027-04-10',
    vetClinic: 'Bệnh viện Thú y PetHealth',
    vetDoctor: 'BS. Minh Đức',
    prescription: 'Theo dõi sưng nốt tiêm trong 24h, không tắm trong 7 ngày',
    notes: 'Bé ngoan, không sốt sau tiêm.'
  },
  {
    id: 'hr_2',
    petId: 'pet_milo',
    type: 'vaccine',
    title: 'Tiêm phòng Vaccine Dại Rabisin',
    date: '2026-05-02',
    nextDueDate: '2027-05-02',
    vetClinic: 'Bệnh viện Thú y PetHealth',
    vetDoctor: 'BS. Lê Nam',
    notes: 'Đã cấp chứng nhận tiêm phòng dại số Rab-2026-99'
  },
  {
    id: 'hr_3',
    petId: 'pet_milo',
    type: 'deworming',
    title: 'Tẩy giun định kỳ Endogard',
    date: '2026-07-01',
    nextDueDate: '2026-10-01',
    vetClinic: 'Tại nhà',
    prescription: '1.5 viên theo trọng lượng 28kg'
  },
  {
    id: 'hr_4',
    petId: 'pet_luna',
    type: 'vaccine',
    title: 'Tiêm vaccine 4 bệnh mèo PureVax',
    date: '2026-03-15',
    nextDueDate: '2027-03-15',
    vetClinic: 'Phòng khám V-Pet',
    vetDoctor: 'BS. Hương Giang'
  },
  {
    id: 'hr_5',
    petId: 'pet_luna',
    type: 'checkup',
    title: 'Khám sức khỏe tổng quát & siêu âm bụng',
    date: '2026-06-20',
    vetClinic: 'Phòng khám V-Pet',
    diagnosis: 'Thận, bàng quang tốt, không có sỏi, men gan bình thường',
    notes: 'Khuyên nên duy trì uống nhiều nước sạch và hạt kiểm soát búi lông'
  }
];

const INITIAL_WEIGHT_RECORDS: WeightRecord[] = [
  { id: 'w_1', petId: 'pet_milo', date: '2026-01-10', weight: 26.2, note: 'Khám đầu năm' },
  { id: 'w_2', petId: 'pet_milo', date: '2026-03-15', weight: 27.0, note: 'Tăng cơ tốt' },
  { id: 'w_3', petId: 'pet_milo', date: '2026-05-20', weight: 27.8, note: 'Tập bơi thường xuyên' },
  { id: 'w_4', petId: 'pet_milo', date: '2026-07-15', weight: 28.2, note: 'Ổn định' },
  { id: 'w_5', petId: 'pet_milo', date: '2026-09-01', weight: 28.5, note: 'Cân nặng chuẩn giống' },

  { id: 'w_6', petId: 'pet_luna', date: '2026-02-01', weight: 3.8, note: 'Sau triệt sản' },
  { id: 'w_7', petId: 'pet_luna', date: '2026-05-10', weight: 4.0, note: 'Ăn hạt indoor' },
  { id: 'w_8', petId: 'pet_luna', date: '2026-08-15', weight: 4.2, note: 'Bộ lông mượt và tròn trịa' }
];

const INITIAL_PHOTOS: PetPhoto[] = [
  {
    id: 'p_1',
    petId: 'pet_milo',
    date: '2024-06-01',
    photoUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80',
    note: 'Lúc 1 tuổi - Vui đùa ở công viên',
    weightAtTime: 23.0
  },
  {
    id: 'p_2',
    petId: 'pet_milo',
    date: '2025-06-01',
    photoUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80',
    note: 'Lúc 2 tuổi - Dáng chuẩn và lông óng ánh',
    weightAtTime: 28.5
  },
  {
    id: 'p_3',
    petId: 'pet_luna',
    date: '2024-03-01',
    photoUrl: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=600&q=80',
    note: 'Mới đón bé về nhà (3 tháng tuổi)',
    weightAtTime: 1.5
  },
  {
    id: 'p_4',
    petId: 'pet_luna',
    date: '2025-08-01',
    photoUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80',
    note: 'Bây giờ đã thành một cô mèo mũm mĩm kiêu sa',
    weightAtTime: 4.2
  }
];

const INITIAL_REMINDERS: Reminder[] = [
  {
    id: 'rem_1',
    petId: 'pet_milo',
    type: 'deworming',
    title: 'Tẩy giun quý 4 cho Milo',
    date: '2026-10-01',
    time: '08:00',
    repeat: 'monthly',
    notes: 'Cho uống cùng bữa ăn sáng',
    priority: 'high',
    isCompleted: false
  },
  {
    id: 'rem_2',
    petId: 'pet_milo',
    type: 'medication',
    title: 'Uống thuốc ngừa ve rận NexGard',
    date: '2026-09-25',
    time: '19:00',
    repeat: 'monthly',
    notes: 'Dạng viên nhai vị bò',
    priority: 'medium',
    isCompleted: false
  },
  {
    id: 'rem_3',
    petId: 'pet_luna',
    type: 'grooming',
    title: 'Cắt móng và chải lông tơ cho Luna',
    date: '2026-09-18',
    time: '15:00',
    repeat: 'weekly',
    priority: 'low',
    isCompleted: false
  }
];

const INITIAL_LOST_PETS: LostPetReport[] = [
  {
    id: 'lost_1',
    petName: 'Bơ (Poodle nâu đỏ)',
    species: 'dog',
    breed: 'Toy Poodle',
    color: 'Nâu đỏ, có đeo vòng cổ chuông bạc',
    gender: 'male',
    microchip: 'VN-982000412311',
    lastSeenDate: '2026-09-12 18:30',
    lastSeenLocation: 'Gần Công viên Cầu Giấy, Hà Nội',
    contactPhone: '0988 123 456',
    reward: '5.000.000 VNĐ cho người tìm thấy',
    notes: 'Bé rất nhát người lạ, sợ tiếng còi xe lớn. Ai thấy xin giữ lại và gọi ngay cho gia đình.',
    photoUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80',
    status: 'lost',
    createdAt: '2026-09-12T19:00:00.000Z'
  },
  {
    id: 'lost_2',
    petName: 'Miu (Tìm thấy mèo lạc)',
    species: 'cat',
    breed: 'Mèo Mướp lai',
    color: 'Vàng trắng, mắt xanh ngọc',
    gender: 'female',
    lastSeenDate: '2026-09-11 10:00',
    lastSeenLocation: 'Đường Nguyễn Thị Minh Khai, Q1, TP.HCM',
    contactPhone: '0912 345 678',
    notes: 'Mình nhặt được bé đang trốn dưới gầm xe oto, rất sạch sẽ và đã biết dùng chậu cát. Chủ bé xin liên hệ.',
    photoUrl: 'https://images.unsplash.com/photo-1561948955-570b270e7c36?auto=format&fit=crop&w=600&q=80',
    status: 'found',
    createdAt: '2026-09-11T12:00:00.000Z'
  }
];

const INITIAL_POSTS: CommunityPost[] = [
  {
    id: 'post_1',
    authorName: 'Hoàng Yến (Mẹ Milo)',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    petTag: 'Golden Retriever',
    title: 'Kinh nghiệm huấn luyện cún đi vệ sinh đúng chỗ chỉ trong 5 ngày',
    content: 'Chào cả nhà, mình muốn chia sẻ tips huấn luyện đi khay vệ sinh bằng phương pháp khen thưởng tích cực (positive reinforcement) và dùng bình xịt mùi định hướng. Bí quyết là phải kiên nhẫn và canh đúng 15 phút sau khi bé ăn xong...',
    category: 'Huấn luyện',
    imageUrl: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80',
    likes: 42,
    isLiked: false,
    commentsCount: 3,
    postType: 'article',
    comments: [
      {
        id: 'c_1',
        author: 'Minh Tuấn',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
        content: 'Bài viết rất hữu ích ạ! Bé nhà em Poodle cũng áp dụng cách này thành công.',
        time: '2 giờ trước'
      },
      {
        id: 'c_2',
        author: 'Thùy Dung',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
        content: 'Cảm ơn bạn chia sẻ rất chi tiết, lưu lại áp dụng cho bé Corgi mới đón về.',
        time: '5 giờ trước'
      }
    ],
    bookmarked: false,
    createdAt: '2026-09-11T14:20:00.000Z'
  },
  {
    id: 'post_video_1',
    authorName: 'BS. Lê Minh (Vet Care)',
    authorAvatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&q=80',
    petTag: 'Bác sĩ Thú Y',
    title: 'Video: Hướng dẫn cắt móng cho cún cưng an toàn không phạm tủy máu',
    content: 'Bác sĩ thú y hướng dẫn trực quan kỹ thuật quan sát đường viền tủy hồng bên trong móng vuốt và cách dùng kềm cắt chuẩn xác 45 độ, giúp cún không bị hoảng sợ hay đau đớn khi cắt tỉa tại nhà.',
    category: 'Chăm sóc chó',
    postType: 'video',
    videoUrl: 'https://www.youtube.com/watch?v=M7lc1UVf-VE',
    youtubeId: 'M7lc1UVf-VE',
    imageUrl: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80'],
    tags: ['cắt móng', 'chăm sóc', 'video hướng dẫn', 'vệ sinh'],
    isVerifiedByDoctor: true,
    isPinned: true,
    likes: 128,
    isLiked: true,
    commentsCount: 8,
    comments: [
      {
        id: 'cv_1',
        author: 'Nguyễn Văn Minh',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
        content: 'Video rất rõ ràng bác sĩ ơi, cún nhà em từ nay đỡ sợ cắt móng rồi!',
        time: '1 ngày trước'
      }
    ],
    bookmarked: true,
    createdAt: '2026-09-12T10:00:00.000Z'
  },
  {
    id: 'post_video_2',
    authorName: 'Bệnh Viện Thú Y PetCare',
    authorAvatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=200&q=80',
    petTag: 'Cấp cứu 24/7',
    title: 'Video Sơ cứu: Xử lý khi chó mèo bị nghẹn hoặc hóc dị vật',
    content: 'Hướng dẫn trực quan nghiệm pháp vỗ lưng và thủ thuật Heimlich thú y để tống xuất dị vật (xương, bóng, đồ chơi cao su) khỏi khí quản trong 3 phút vàng trước khi chuyển tới phòng cấp cứu.',
    category: 'Sức khỏe',
    postType: 'video',
    videoUrl: 'https://www.youtube.com/watch?v=W34zT3J3rB8',
    youtubeId: 'W34zT3J3rB8',
    imageUrl: 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?auto=format&fit=crop&w=800&q=80',
    tags: ['sơ cứu', 'hóc dị vật', 'cấp cứu thú y', 'video'],
    isVerifiedByDoctor: true,
    isPinned: true,
    likes: 245,
    isLiked: false,
    commentsCount: 12,
    comments: [],
    bookmarked: true,
    createdAt: '2026-09-11T08:30:00.000Z'
  },
  {
    id: 'post_2',
    authorName: 'BS. Lê Minh (Vet Care)',
    authorAvatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&q=80',
    petTag: 'Bác sĩ Thú Y',
    title: 'Cảnh báo: Mùa mưa phùn và các bệnh đường hô hấp thường gặp ở mèo',
    content: 'Mùa thay đổi thời tiết là thời điểm mèo dễ bị sổ mũi, hắt hơi liên tục do virus Herpes (FHV-1) hoặc Calicivirus. Đừng nhầm lẫn với cảm lạnh thông thường. Khi mèo có dấu hiệu chảy nước mắt đặc, loét miệng hoặc sốt, hãy đưa đi khám ngay...',
    category: 'Sức khỏe',
    postType: 'article',
    isVerifiedByDoctor: true,
    imageUrl: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=800&q=80',
    likes: 89,
    isLiked: true,
    commentsCount: 6,
    comments: [],
    bookmarked: true,
    createdAt: '2026-09-10T09:15:00.000Z'
  }
];

const INITIAL_USER: UserProfile = {
  id: 'user_default',
  name: 'Nguyễn Thanh Tùng',
  email: 'thanhtung.petcare@gmail.com',
  phone: '0901 234 567',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  address: 'Ba Đình, Hà Nội',
  emergencyContact: '0988 765 432',
  emergencyContactName: 'BS. Nam (Bệnh Viện Thú Y PetHealth)',
  isLoggedIn: true
};

export const storage = {
  getPets(): Pet[] {
    const raw = localStorage.getItem(STORAGE_KEYS.PETS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PETS, JSON.stringify(INITIAL_PETS));
      return INITIAL_PETS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_PETS;
    }
  },

  savePets(pets: Pet[]) {
    localStorage.setItem(STORAGE_KEYS.PETS, JSON.stringify(pets));
  },

  getActivePetId(): string {
    const active = localStorage.getItem(STORAGE_KEYS.ACTIVE_PET_ID);
    if (active) return active;
    const pets = this.getPets();
    const defaultId = pets.length > 0 ? pets[0].id : 'pet_milo';
    this.setActivePetId(defaultId);
    return defaultId;
  },

  setActivePetId(id: string) {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_PET_ID, id);
  },

  getHealthRecords(petId?: string): HealthRecord[] {
    const raw = localStorage.getItem(STORAGE_KEYS.HEALTH_RECORDS);
    const list: HealthRecord[] = raw ? JSON.parse(raw) : INITIAL_HEALTH_RECORDS;
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.HEALTH_RECORDS, JSON.stringify(INITIAL_HEALTH_RECORDS));
    }
    return petId ? list.filter(r => r.petId === petId) : list;
  },

  saveHealthRecord(record: HealthRecord) {
    const all = this.getHealthRecords();
    const idx = all.findIndex(r => r.id === record.id);
    if (idx >= 0) {
      all[idx] = record;
    } else {
      all.unshift(record);
    }
    localStorage.setItem(STORAGE_KEYS.HEALTH_RECORDS, JSON.stringify(all));
  },

  deleteHealthRecord(id: string) {
    const all = this.getHealthRecords().filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEYS.HEALTH_RECORDS, JSON.stringify(all));
  },

  getWeightRecords(petId: string): WeightRecord[] {
    const raw = localStorage.getItem(STORAGE_KEYS.WEIGHT_RECORDS);
    const list: WeightRecord[] = raw ? JSON.parse(raw) : INITIAL_WEIGHT_RECORDS;
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.WEIGHT_RECORDS, JSON.stringify(INITIAL_WEIGHT_RECORDS));
    }
    return list
      .filter(w => w.petId === petId)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  },

  addWeightRecord(record: WeightRecord) {
    const raw = localStorage.getItem(STORAGE_KEYS.WEIGHT_RECORDS);
    const all: WeightRecord[] = raw ? JSON.parse(raw) : INITIAL_WEIGHT_RECORDS;
    all.push(record);
    localStorage.setItem(STORAGE_KEYS.WEIGHT_RECORDS, JSON.stringify(all));

    // Also update pet current weight
    const pets = this.getPets();
    const pet = pets.find(p => p.id === record.petId);
    if (pet) {
      pet.weight = record.weight;
      this.savePets(pets);
    }
  },

  getPhotos(petId: string): PetPhoto[] {
    const raw = localStorage.getItem(STORAGE_KEYS.PHOTOS);
    const list: PetPhoto[] = raw ? JSON.parse(raw) : INITIAL_PHOTOS;
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PHOTOS, JSON.stringify(INITIAL_PHOTOS));
    }
    return list
      .filter(p => p.petId === petId)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  },

  addPhoto(photo: PetPhoto) {
    const raw = localStorage.getItem(STORAGE_KEYS.PHOTOS);
    const all: PetPhoto[] = raw ? JSON.parse(raw) : INITIAL_PHOTOS;
    all.push(photo);
    localStorage.setItem(STORAGE_KEYS.PHOTOS, JSON.stringify(all));
  },

  getReminders(petId?: string): Reminder[] {
    const raw = localStorage.getItem(STORAGE_KEYS.REMINDERS);
    if (!raw) {
      const pets = this.getPets();
      const hasDemoPets = pets.some(p => p.id === 'pet_milo' || p.id === 'pet_luna');
      const initial = hasDemoPets ? INITIAL_REMINDERS : [];
      localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(initial));
      return petId ? initial.filter(r => r.petId === petId) : initial;
    }
    const list: Reminder[] = JSON.parse(raw);
    return petId ? list.filter(r => r.petId === petId) : list;
  },

  saveReminders(reminders: Reminder[]) {
    localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(reminders));
  },

  saveReminder(reminder: Reminder) {
    const all = this.getReminders();
    const idx = all.findIndex(r => r.id === reminder.id);
    if (idx >= 0) {
      all[idx] = reminder;
    } else {
      all.unshift(reminder);
    }
    localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(all));
  },

  toggleReminder(id: string) {
    const all = this.getReminders();
    const item = all.find(r => r.id === id);
    if (item) {
      item.isCompleted = !item.isCompleted;
      localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(all));
    }
  },

  deleteReminder(id: string) {
    const all = this.getReminders().filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(all));
  },

  getLostPets(): LostPetReport[] {
    const raw = localStorage.getItem(STORAGE_KEYS.LOST_PETS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.LOST_PETS, JSON.stringify(INITIAL_LOST_PETS));
      return INITIAL_LOST_PETS;
    }
    return JSON.parse(raw);
  },

  addLostPet(report: LostPetReport) {
    const all = this.getLostPets();
    all.unshift(report);
    localStorage.setItem(STORAGE_KEYS.LOST_PETS, JSON.stringify(all));
  },

  getPosts(): CommunityPost[] {
    const raw = localStorage.getItem(STORAGE_KEYS.POSTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(INITIAL_POSTS));
      return INITIAL_POSTS;
    }
    return JSON.parse(raw);
  },

  savePost(post: CommunityPost) {
    const all = this.getPosts();
    all.unshift(post);
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(all));
  },

  updatePost(post: CommunityPost) {
    const all = this.getPosts();
    const idx = all.findIndex(p => p.id === post.id);
    if (idx >= 0) {
      all[idx] = { ...all[idx], ...post, updatedAt: new Date().toISOString() };
      localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(all));
    }
  },

  deletePost(id: string) {
    const all = this.getPosts().filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(all));
  },

  toggleLikePost(postId: string) {
    const all = this.getPosts();
    const post = all.find(p => p.id === postId);
    if (post) {
      post.isLiked = !post.isLiked;
      post.likes = post.isLiked ? post.likes + 1 : post.likes - 1;
      localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(all));
    }
  },

  addComment(postId: string, commentText: string) {
    const all = this.getPosts();
    const post = all.find(p => p.id === postId);
    if (post) {
      post.comments.push({
        id: 'c_' + Date.now(),
        author: 'Bạn (Người dùng)',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
        content: commentText,
        time: 'Vừa xong'
      });
      post.commentsCount = post.comments.length;
      localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(all));
    }
  },

  getUser(): UserProfile {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    return raw ? JSON.parse(raw) : INITIAL_USER;
  },

  saveUser(user: UserProfile) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  isOnboarded(): boolean {
    return localStorage.getItem(STORAGE_KEYS.ONBOARDED) === 'true';
  },

  setOnboarded(value: boolean) {
    localStorage.setItem(STORAGE_KEYS.ONBOARDED, value ? 'true' : 'false');
  },

  getTheme(): 'light' | 'dark' {
    return (localStorage.getItem(STORAGE_KEYS.THEME) as 'light' | 'dark') || 'light';
  },

  setTheme(theme: 'light' | 'dark') {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    document.documentElement.setAttribute('data-theme', theme);
  },

  resetAllData() {
    localStorage.clear();
    localStorage.setItem(STORAGE_KEYS.ONBOARDED, 'true');
    this.getPets();
    this.getHealthRecords();
    this.getWeightRecords('pet_milo');
    this.getReminders();
    this.getLostPets();
    this.getPosts();
  }
};
