export type PetSpecies = 'dog' | 'cat' | 'other';
export type PetGender = 'male' | 'female';

export interface Pet {
  id: string;
  name: string;
  species: PetSpecies;
  breed: string;
  gender: PetGender;
  birthDate?: string;
  estimatedAge?: string;
  weight: number; // in kg
  coatColor: string;
  avatar: string;
  microchip?: string;
  isNeutered: boolean;
  allergies?: string[];
  chronicConditions?: string[];
  currentMedications?: string[];
  preferredVet?: string;
  createdAt: string;
}

export interface PetPhoto {
  id: string;
  petId: string;
  date: string;
  photoUrl: string;
  note?: string;
  weightAtTime?: number;
  heightAtTime?: number;
}

export interface WeightRecord {
  id: string;
  petId: string;
  date: string;
  weight: number;
  note?: string;
}

export type HealthRecordType = 
  | 'vaccine' 
  | 'checkup' 
  | 'illness' 
  | 'medication' 
  | 'allergy' 
  | 'surgery' 
  | 'deworming' 
  | 'treatment' 
  | 'lab';

export interface HealthRecord {
  id: string;
  petId: string;
  type: HealthRecordType;
  title: string;
  date: string;
  vetClinic?: string;
  vetDoctor?: string;
  diagnosis?: string;
  prescription?: string;
  nextDueDate?: string;
  documentUrl?: string;
  notes?: string;
}

export type ReminderType = 
  | 'vaccine' 
  | 'medication' 
  | 'deworming' 
  | 'checkup' 
  | 'grooming' 
  | 'feeding' 
  | 'other';

export type ReminderPriority = 'low' | 'medium' | 'high';
export type RepeatFrequency = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface Reminder {
  id: string;
  petId: string;
  type: ReminderType;
  title: string;
  date: string;
  time: string;
  repeat: RepeatFrequency;
  notes?: string;
  priority: ReminderPriority;
  isCompleted: boolean;
}

export type UrgencyLevel = 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';

export interface EmergencyCase {
  id: string;
  title: string;
  keywords: string[];
  urgencyLevel: UrgencyLevel;
  badgeLabel: string;
  summary: string;
  doImmediately: string[];
  doNotDo: string[];
  dangerSigns: string[];
  nextActions: {
    label: string;
    actionType: 'call' | 'find_vet' | 'share_location' | 'guide';
    detail?: string;
  }[];
}

export type LocationType = 'hospital_247' | 'clinic' | 'pet_store' | 'grooming';

export interface VetLocation {
  id: string;
  name: string;
  type: LocationType;
  address: string;
  phone: string;
  distanceKm: number;
  rating: number;
  reviewsCount: number;
  is247: boolean;
  isOpenNow: boolean;
  hours: string;
  lat: number;
  lng: number;
  source?: 'google_places' | 'database' | 'mock';
}

export interface LostPetReport {
  id: string;
  petName: string;
  species: PetSpecies;
  breed: string;
  color: string;
  gender: PetGender;
  microchip?: string;
  lastSeenDate: string;
  lastSeenLocation: string;
  contactPhone: string;
  reward?: string;
  notes?: string;
  photoUrl: string;
  status: 'lost' | 'found';
  createdAt: string;
}

export interface PostComment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  time: string;
}

export type PostType = 'article' | 'video' | 'tip' | 'qa';

export interface CommunityPost {
  id: string;
  userId?: string;
  authorName: string;
  authorAvatar: string;
  petTag?: string;
  title: string;
  content: string;
  category: string;
  postType?: PostType;
  videoUrl?: string;
  youtubeId?: string;
  imageUrl?: string;
  images?: string[];
  tags?: string[];
  isVerifiedByDoctor?: boolean;
  isPinned?: boolean;
  likes: number;
  isLiked?: boolean;
  commentsCount: number;
  comments: PostComment[];
  bookmarked?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CareVideo {
  id: string;
  title: string;
  duration: string;
  category: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  level: 'Cơ bản' | 'Trung bình' | 'Nâng cao';
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  category: string;
  summary: string;
  readTime: string;
  content: string[];
  warning?: string;
  source: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  address?: string;
  emergencyContact?: string;
  emergencyContactName?: string;
  isLoggedIn: boolean;
}
