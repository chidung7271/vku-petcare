import React, { useState, useEffect } from 'react';
import { VetLocation, LocationType } from '../types';
import { locationService, GeolocationStatus } from '../services/locationService';
import { 
  MapPin, 
  Phone, 
  Navigation, 
  Search, 
  Clock, 
  Star, 
  AlertCircle, 
  Compass, 
  Hospital, 
  ShoppingBag, 
  Scissors, 
  Stethoscope 
} from 'lucide-react';

interface LocationsViewProps {
  onShowToast: (text: string, type: 'success' | 'warning' | 'info' | 'error') => void;
}

export const LocationsView: React.FC<LocationsViewProps> = ({ onShowToast }) => {
  const [filterType, setFilterType] = useState<LocationType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | undefined>();
  const [geoStatus, setGeoStatus] = useState<GeolocationStatus>('idle');
  const [locations, setLocations] = useState<VetLocation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load locations
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    locationService.getLocationsAsync(userCoords, filterType, searchQuery)
      .then(list => {
        if (isMounted) {
          setLocations(list);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setLocations(locationService.getLocations(userCoords, filterType, searchQuery));
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [userCoords, filterType, searchQuery]);

  const handleRequestGPS = async () => {
    setGeoStatus('requesting');
    try {
      const coords = await locationService.getCurrentPosition();
      setUserCoords(coords);
      setGeoStatus('granted');
      onShowToast('Đã định vị thành công! Đang sắp xếp cơ sở thú y gần bạn nhất.', 'success');
    } catch {
      setGeoStatus('denied');
      onShowToast('Không thể lấy vị trí. Bạn có thể nhập quận/thành phố để tìm kiếm.', 'warning');
    }
  };

  const handleOpenNavigation = (loc: VetLocation) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}`;
    window.open(url, '_blank');
  };

  return (
    <div className="locations-container animate-fade-in">
      {/* Header */}
      <div className="locations-header-card card">
        <div className="loc-header-left">
          <div className="loc-icon-circle">
            <Compass size={24} />
          </div>
          <div>
            <h2 className="loc-title">Tìm Cơ Sở Thú Y & Pet Store</h2>
            <p className="loc-sub">Danh bạ bệnh viện 24/7, phòng khám và dịch vụ gần bạn</p>
          </div>
        </div>

        <button 
          className={`btn-primary btn-sm ${geoStatus === 'granted' ? 'active-gps' : ''}`}
          onClick={handleRequestGPS}
        >
          <MapPin size={15} />
          <span>{geoStatus === 'granted' ? 'Đã bật GPS' : 'Gần tôi nhất'}</span>
        </button>
      </div>

      {/* Permission Denied Notice */}
      {geoStatus === 'denied' && (
        <div className="gps-denied-box card">
          <AlertCircle size={20} className="alert-icon" />
          <div className="denied-text">
            <strong>Bạn chưa cấp quyền vị trí GPS</strong>
            <p>Bạn có thể bật quyền vị trí trong cài đặt thiết bị hoặc nhập tên quận / thành phố (VD: Hà Nội, TP.HCM) vào ô tìm kiếm bên dưới.</p>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="filter-pill-bar">
        <button 
          className={`filter-chip ${filterType === 'all' ? 'active' : ''}`}
          onClick={() => setFilterType('all')}
        >
          Tất cả
        </button>
        <button 
          className={`filter-chip ${filterType === 'hospital_247' ? 'active' : ''}`}
          onClick={() => setFilterType('hospital_247')}
        >
          🚨 Bệnh viện 24/7
        </button>
        <button 
          className={`filter-chip ${filterType === 'clinic' ? 'active' : ''}`}
          onClick={() => setFilterType('clinic')}
        >
          🩺 Phòng khám
        </button>
        <button 
          className={`filter-chip ${filterType === 'pet_store' ? 'active' : ''}`}
          onClick={() => setFilterType('pet_store')}
        >
          🛍️ Cửa hàng Pet
        </button>
        <button 
          className={`filter-chip ${filterType === 'grooming' ? 'active' : ''}`}
          onClick={() => setFilterType('grooming')}
        >
          ✂️ Spa & Grooming
        </button>
      </div>

      {/* Search Input */}
      <div className="search-box">
        <Search size={18} className="search-icon" />
        <input 
          type="text" 
          placeholder="Tìm theo tên bệnh viện, đường, khu vực (Cầu Giấy, Q1...)"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Location Cards List */}
      {isLoading && (
        <div style={{ textAlign: 'center', padding: '10px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          Đang tìm kiếm cơ sở thú y quanh bạn...
        </div>
      )}
      <div className="locations-list">
        {locations.length > 0 ? (
          locations.map(loc => (
            <div key={loc.id} className="location-card card">
              <div className="loc-top-row">
                <div className="loc-tags">
                  {loc.is247 ? (
                    <span className="badge badge-emergency">MỞ CỬA 24/7</span>
                  ) : (
                    <span className="badge badge-primary">
                      {loc.type === 'clinic' ? 'Phòng khám' : loc.type === 'pet_store' ? 'Cửa hàng Pet' : loc.type === 'grooming' ? 'Spa & Grooming' : 'Bệnh viện'}
                    </span>
                  )}
                  <span className="distance-badge">📍 Cách {loc.distanceKm} km</span>
                </div>

                <div className="rating-pill">
                  <Star size={13} className="star-icon" />
                  <span>{loc.rating}</span>
                  <span className="reviews">({loc.reviewsCount})</span>
                </div>
              </div>

              <h3 className="loc-name">{loc.name}</h3>
              <p className="loc-address">🏠 {loc.address}</p>
              
              <div className="loc-hours-row">
                <Clock size={14} className="clock-icon" />
                <span>{loc.hours}</span>
              </div>

              <div className="loc-action-bar">
                <a href={`tel:${loc.phone}`} className="btn-call">
                  <Phone size={16} />
                  <span>Gọi {loc.phone}</span>
                </a>

                <button className="btn-direction" onClick={() => handleOpenNavigation(loc)}>
                  <Navigation size={16} />
                  <span>Chỉ đường</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="state-container">
            <MapPin size={38} className="state-icon" />
            <h4 className="state-title">Không tìm thấy địa điểm phù hợp</h4>
            <p className="state-desc">Hãy thử xóa bộ lọc hoặc tìm kiếm theo từ khóa khu vực khác.</p>
          </div>
        )}
      </div>

      <style>{`
        .locations-container {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .locations-header-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 16px;
          background: var(--primary-gradient-subtle);
          border: 1px solid var(--primary-light);
        }

        .loc-header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .loc-icon-circle {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-md);
          background: var(--primary);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .loc-title {
          font-size: 1.05rem;
        }

        .loc-sub {
          font-size: 0.74rem;
          color: var(--text-muted);
        }

        .active-gps {
          background: var(--success) !important;
        }

        .gps-denied-box {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 12px;
          background: var(--warning-soft);
          border: 1px solid rgba(245, 158, 11, 0.4);
          font-size: 0.8rem;
        }

        .alert-icon {
          color: var(--warning);
          flex-shrink: 0;
          margin-top: 2px;
        }

        .denied-text strong {
          display: block;
          margin-bottom: 2px;
        }

        .denied-text p {
          color: var(--text-muted);
          font-size: 0.75rem;
        }

        .filter-pill-bar {
          display: flex;
          gap: 6px;
          overflow-x: auto;
          padding-bottom: 2px;
        }

        .filter-chip {
          min-height: 36px;
          padding: 4px 12px;
          border-radius: var(--radius-full);
          border: 1px solid var(--border-color);
          background: var(--bg-card);
          font-size: 0.78rem;
          color: var(--text-muted);
          white-space: nowrap;
        }

        .filter-chip.active {
          background: var(--primary);
          color: #ffffff;
          border-color: var(--primary);
          font-weight: 700;
        }

        .locations-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .location-card {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 14px;
        }

        .loc-top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .loc-tags {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .distance-badge {
          font-size: 0.74rem;
          font-weight: 700;
          color: var(--primary-dark);
        }

        .rating-pill {
          display: flex;
          align-items: center;
          gap: 3px;
          font-size: 0.76rem;
          font-weight: 700;
          color: var(--text-main);
        }

        .star-icon {
          color: #f59e0b;
          fill: #f59e0b;
        }

        .rating-pill .reviews {
          color: var(--text-muted);
          font-weight: 400;
        }

        .loc-name {
          font-size: 1rem;
          color: var(--text-main);
        }

        .loc-address {
          font-size: 0.8rem;
          color: var(--text-muted);
          line-height: 1.35;
        }

        .loc-hours-row {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.76rem;
          color: #047857;
          font-weight: 600;
        }

        .clock-icon {
          color: #047857;
        }

        .loc-action-bar {
          display: flex;
          gap: 10px;
          margin-top: 6px;
        }

        .btn-call {
          flex: 1;
          min-height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          background: var(--primary);
          color: #ffffff;
          border-radius: var(--radius-md);
          font-size: 0.82rem;
          font-weight: 700;
          text-decoration: none;
        }

        .btn-direction {
          flex: 1;
          min-height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          background: var(--secondary-soft);
          color: var(--secondary);
          border-radius: var(--radius-md);
          font-size: 0.82rem;
          font-weight: 700;
          border: 1px solid var(--border-color);
        }

        [data-theme="dark"] .btn-direction {
          color: var(--primary-light);
        }
      `}</style>
    </div>
  );
};
