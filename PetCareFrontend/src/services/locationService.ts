import { VetLocation, LocationType } from '../types';
import { apiClient } from './apiClient';

export const MOCK_LOCATIONS: VetLocation[] = [
  {
    id: 'loc_1',
    name: 'Bệnh viện Thú y 24/7 PetHealth Cầu Giấy',
    type: 'hospital_247',
    address: 'Số 240 Âu Cơ, Tây Hồ & Trần Thái Tông, Cầu Giấy, Hà Nội',
    phone: '024 2242 8882',
    distanceKm: 1.2,
    rating: 4.8,
    reviewsCount: 340,
    is247: true,
    isOpenNow: true,
    hours: 'Mở cửa 24/7 (Cấp cứu xuyên đêm)',
    lat: 21.0378,
    lng: 105.7895
  },
  {
    id: 'loc_2',
    name: 'Bệnh viện Thú y Quốc tế Samyang Animal Clinic',
    type: 'hospital_247',
    address: 'Số 116 Nguyễn Văn Hưởng, Thảo Điền, TP. Thủ Đức, TP.HCM',
    phone: '028 7300 0088',
    distanceKm: 2.5,
    rating: 4.9,
    reviewsCount: 520,
    is247: true,
    isOpenNow: true,
    hours: 'Mở cửa 24/7 (Phẫu thuật & Cấp cứu)',
    lat: 10.8035,
    lng: 106.7314
  },
  {
    id: 'loc_3',
    name: 'Phòng khám Thú y V-Pet Care Đống Đa',
    type: 'clinic',
    address: 'Số 54 Thái Thịnh, Đống Đa, Hà Nội',
    phone: '0988 543 210',
    distanceKm: 3.1,
    rating: 4.7,
    reviewsCount: 185,
    is247: false,
    isOpenNow: true,
    hours: '08:00 - 21:00 hàng ngày',
    lat: 21.0112,
    lng: 105.8190
  },
  {
    id: 'loc_4',
    name: 'Bệnh viện Thú y Đại học Nông Lâm TP.HCM',
    type: 'hospital_247',
    address: 'Khu phố 6, P. Linh Trung, TP. Thủ Đức, TP.HCM',
    phone: '028 3896 6780',
    distanceKm: 4.8,
    rating: 4.6,
    reviewsCount: 890,
    is247: true,
    isOpenNow: true,
    hours: 'Mở cửa 24/7',
    lat: 10.8711,
    lng: 106.7915
  },
  {
    id: 'loc_5',
    name: 'Siêu thị Thú Cưng Pet Mart & Spa Grooming',
    type: 'pet_store',
    address: 'Số 206 Kim Mã, Ba Đình, Hà Nội',
    phone: '024 7106 9906',
    distanceKm: 1.8,
    rating: 4.7,
    reviewsCount: 410,
    is247: false,
    isOpenNow: true,
    hours: '08:30 - 22:00',
    lat: 21.0315,
    lng: 105.8235
  },
  {
    id: 'loc_6',
    name: 'Grooming & Pet Store Hachiko Spa',
    type: 'grooming',
    address: 'Số 152 Lê Lai, P. Bến Thành, Quận 1, TP.HCM',
    phone: '0903 888 777',
    distanceKm: 2.1,
    rating: 4.9,
    reviewsCount: 230,
    is247: false,
    isOpenNow: true,
    hours: '09:00 - 20:00',
    lat: 10.7712,
    lng: 106.6914
  }
];

// Haversine formula to calculate accurate distance between two coordinates
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in KM
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export type GeolocationStatus = 'idle' | 'requesting' | 'granted' | 'denied' | 'unsupported';

export const locationService = {
  getCurrentPosition(): Promise<{ lat: number; lng: number }> {
    return new Promise((resolve, reject) => {
      if (!('geolocation' in navigator)) {
        reject(new Error('Trình duyệt không hỗ trợ định vị GPS'));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          reject(error);
        },
        { timeout: 8000, enableHighAccuracy: true }
      );
    });
  },

  async getLocationsAsync(
    userCoords?: { lat: number; lng: number },
    filterType?: LocationType | 'all',
    query?: string
  ): Promise<VetLocation[]> {
    try {
      const res: any = await apiClient.getNearbyLocations({
        lat: userCoords?.lat,
        lng: userCoords?.lng,
        radius: 15,
        type: filterType !== 'all' ? filterType : undefined,
        search: query,
      });

      const items = Array.isArray(res) ? res : (Array.isArray(res?.data) ? res.data : null);

      if (items !== null) {
        return items.map((loc: any) => {
          let locType: LocationType = 'clinic';
          if (loc.type === 'PET_STORE' || loc.type === 'pet_store') locType = 'pet_store';
          else if (loc.type === 'GROOMING' || loc.type === 'grooming') locType = 'grooming';
          else if (loc.type === 'VET_HOSPITAL' || loc.type === 'hospital_247' || loc.is24Hours) locType = 'hospital_247';

          return {
            id: loc._id || loc.id || 'loc_' + Math.random(),
            name: loc.name,
            type: locType,
            address: loc.address,
            phone: loc.phone || 'Xem trên bản đồ',
            distanceKm: typeof loc.distance === 'number'
              ? loc.distance
              : (userCoords ? calculateDistanceKm(userCoords.lat, userCoords.lng, loc.latitude || loc.lat, loc.longitude || loc.lng) : 1.0),
            rating: loc.rating || 4.8,
            reviewsCount: loc.reviewsCount || 50,
            is247: !!loc.is24Hours,
            isOpenNow: loc.isOpenNow ?? true,
            hours: loc.openingHours || (loc.is24Hours ? 'Mở cửa 24/7' : '08:00 - 21:00'),
            lat: loc.latitude || loc.lat,
            lng: loc.longitude || loc.lng,
            source: loc.source || 'google_places',
          };
        });
      }
    } catch (err: any) {
      console.warn('[LocationService] API backend failed, using mock data:', err.message);
    }

    // Fallback to local MOCK_LOCATIONS only if backend completely unreachable
    return this.getLocations(userCoords, filterType, query);
  },

  getLocations(userCoords?: { lat: number; lng: number }, filterType?: LocationType | 'all', query?: string): VetLocation[] {
    let list = [...MOCK_LOCATIONS];

    if (userCoords) {
      list = list.map(loc => ({
        ...loc,
        distanceKm: calculateDistanceKm(userCoords.lat, userCoords.lng, loc.lat, loc.lng)
      }));
      list.sort((a, b) => a.distanceKm - b.distanceKm);
    }

    if (filterType && filterType !== 'all') {
      list = list.filter(l => l.type === filterType);
    }

    if (query && query.trim()) {
      const q = query.toLowerCase().trim();
      list = list.filter(l => 
        l.name.toLowerCase().includes(q) || 
        l.address.toLowerCase().includes(q)
      );
    }

    return list;
  }
};
