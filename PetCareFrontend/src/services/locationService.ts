import { VetLocation, LocationType } from '../types';
import { apiClient } from './apiClient';

export const MOCK_LOCATIONS: VetLocation[] = [
  {
    id: 'loc_1',
    name: 'Bệnh viện Thú y 24/7 PetCare Đống Đa',
    type: 'hospital_247',
    address: 'Số 124 Hoàng Cầu, Ô Chợ Dừa, Đống Đa, Hà Nội',
    phone: '0988 123 456',
    distanceKm: 1.2,
    rating: 4.9,
    reviewsCount: 328,
    is247: true,
    isOpenNow: true,
    hours: 'Mở cửa 24/7 (Cấp cứu xuyên đêm)',
    lat: 21.0182,
    lng: 105.8234
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
    name: 'Phòng khám Thú y Cầu Giấy Vet Clinic',
    type: 'clinic',
    address: 'Số 86 Trần Thái Tông, Dịch Vọng Hậu, Cầu Giấy, Hà Nội',
    phone: '024 6688 2244',
    distanceKm: 1.8,
    rating: 4.7,
    reviewsCount: 195,
    is247: false,
    isOpenNow: true,
    hours: '08:00 - 21:00 hàng ngày',
    lat: 21.0335,
    lng: 105.7891
  },
  {
    id: 'loc_4',
    name: 'Trạm Xá Cấp Cứu Thú Y Đà Nẵng 24/7',
    type: 'hospital_247',
    address: 'Số 45 Nguyễn Văn Linh, Nam Dương, Hải Châu, Đà Nẵng',
    phone: '0905 111 222',
    distanceKm: 1.1,
    rating: 4.8,
    reviewsCount: 210,
    is247: true,
    isOpenNow: true,
    hours: 'Mở cửa 24/7 (Trực cấp cứu)',
    lat: 16.0602,
    lng: 108.2163
  },
  {
    id: 'loc_5',
    name: 'Bệnh Viện Thú Y Danang Vet Hospital 24/7',
    type: 'hospital_247',
    address: 'Số 120 Điện Biên Phủ, Chính Gián, Thanh Khê, Đà Nẵng',
    phone: '0905 888 999',
    distanceKm: 2.4,
    rating: 4.8,
    reviewsCount: 180,
    is247: true,
    isOpenNow: true,
    hours: 'Mở cửa 24/7 (Xe cấp cứu lưu động)',
    lat: 16.0658,
    lng: 108.1925
  },
  {
    id: 'loc_6',
    name: 'Phòng khám Thú y Sơn Trà Pet Clinic',
    type: 'clinic',
    address: 'Số 34 Ngô Quyền, Thọ Quang, Sơn Trà, Đà Nẵng',
    phone: '0905 333 444',
    distanceKm: 3.2,
    rating: 4.6,
    reviewsCount: 145,
    is247: false,
    isOpenNow: true,
    hours: '08:00 - 20:30',
    lat: 16.0821,
    lng: 108.2354
  },
  {
    id: 'loc_7',
    name: 'Trạm Cấp Cứu Thú Y Hải Châu 24/7',
    type: 'hospital_247',
    address: 'Số 88 Trưng Nữ Vương, Bình Hiên, Hải Châu, Đà Nẵng',
    phone: '0905 555 666',
    distanceKm: 1.5,
    rating: 4.7,
    reviewsCount: 160,
    is247: true,
    isOpenNow: true,
    hours: 'Mở cửa 24/7 (Cấp cứu ngộ độc & chấn thương)',
    lat: 16.0543,
    lng: 108.2201
  },
  {
    id: 'loc_8',
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
    id: 'loc_9',
    name: 'Bệnh Viện Thú Y 24/7 PetHealth Tây Hồ',
    type: 'hospital_247',
    address: 'Số 240 Âu Cơ, Quảng An, Tây Hồ, Hà Nội',
    phone: '024 2242 8882',
    distanceKm: 3.5,
    rating: 4.8,
    reviewsCount: 340,
    is247: true,
    isOpenNow: true,
    hours: 'Mở cửa 24/7',
    lat: 21.0655,
    lng: 105.8282
  },
  {
    id: 'loc_10',
    name: 'Bệnh Viện Thú Y Asvelis Cấp Cứu 24/7',
    type: 'hospital_247',
    address: 'D1 Khu Ngoại Giao Đoàn, Xuân Tảo, Bắc Từ Liêm, Hà Nội',
    phone: '0904 306 996',
    distanceKm: 4.2,
    rating: 4.9,
    reviewsCount: 260,
    is247: true,
    isOpenNow: true,
    hours: 'Mở cửa 24/7 (Chuẩn quốc tế)',
    lat: 21.0592,
    lng: 105.7945
  },
  {
    id: 'loc_11',
    name: 'Phòng Khám Thú Y PetPro Tân Bình 24/7',
    type: 'hospital_247',
    address: 'Số 192 Cộng Hòa, Phường 12, Tân Bình, TP.HCM',
    phone: '0913 949 041',
    distanceKm: 2.8,
    rating: 4.7,
    reviewsCount: 430,
    is247: true,
    isOpenNow: true,
    hours: 'Mở cửa 24/7',
    lat: 10.7981,
    lng: 106.6492
  },
  {
    id: 'loc_12',
    name: 'Bệnh Viện Thú Y New Pet Hospital 24/7',
    type: 'hospital_247',
    address: 'Số 53 Đặng Dung, Phường Tân Định, Quận 1, TP.HCM',
    phone: '028 6269 3939',
    distanceKm: 1.9,
    rating: 4.8,
    reviewsCount: 310,
    is247: true,
    isOpenNow: true,
    hours: 'Mở cửa 24/7',
    lat: 10.7912,
    lng: 106.6895
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
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
      );
    });
  },

  async getLocationsAsync(
    userCoords?: { lat: number; lng: number },
    filterType: LocationType | 'all' = 'all',
    searchQuery: string = ''
  ): Promise<VetLocation[]> {
    try {
      const params: any = { radius: 15 };
      if (userCoords) {
        params.lat = userCoords.lat;
        params.lng = userCoords.lng;
      }
      if (filterType !== 'all') {
        params.type = filterType;
      }
      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }

      const res = await apiClient.getLocations(params);
      const rawList = Array.isArray(res) ? res : res?.data || [];
      if (Array.isArray(rawList) && rawList.length > 0) {
        return rawList.map((item: any, idx: number) => ({
          id: item._id || item.id || `loc_api_${idx}`,
          name: item.name,
          type: item.type === 'VET_HOSPITAL' || item.type === 'hospital_247' ? 'hospital_247' : (item.type || 'clinic'),
          address: item.address,
          phone: item.hotline || item.phone || '19008668',
          distanceKm: item.distance !== undefined ? Math.round(item.distance * 10) / 10 : (item.distanceKm || 1.5),
          rating: item.rating || 4.8,
          reviewsCount: item.reviewCount || item.reviewsCount || 150,
          is247: Boolean(item.isOpen247 || item.is24Hours || item.type === 'hospital_247' || item.type === 'VET_HOSPITAL'),
          isOpenNow: true,
          hours: item.isOpen247 || item.is24Hours ? 'Mở cửa 24/7 (Trực cấp cứu)' : '08:00 - 21:00',
          lat: item.latitude || item.lat,
          lng: item.longitude || item.lng
        }));
      }
    } catch {
      // Fallback to local 12 real clinics
    }
    return this.getLocations(userCoords, filterType, searchQuery);
  },

  getLocations(
    userCoords?: { lat: number; lng: number },
    filterType: LocationType | 'all' = 'all',
    searchQuery: string = ''
  ): VetLocation[] {
    let result = [...MOCK_LOCATIONS];

    if (userCoords) {
      result = result.map(loc => ({
        ...loc,
        distanceKm: calculateDistanceKm(userCoords.lat, userCoords.lng, loc.lat, loc.lng)
      }));
      result.sort((a, b) => a.distanceKm - b.distanceKm);
    }

    if (filterType !== 'all') {
      result = result.filter(loc => loc.type === filterType);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        loc => loc.name.toLowerCase().includes(q) || loc.address.toLowerCase().includes(q)
      );
    }

    return result;
  }
};
