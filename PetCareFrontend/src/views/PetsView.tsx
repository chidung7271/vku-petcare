import React, { useState } from 'react';
import { Pet, PetPhoto, WeightRecord, Reminder } from '../types';
import { WeightChart } from '../components/WeightChart';
import { 
  Camera, 
  Plus, 
  Calendar, 
  ShieldAlert, 
  Scale, 
  Check, 
  SlidersHorizontal, 
  ChevronRight, 
  Sparkles, 
  HeartHandshake,
  Clock,
  Edit3,
  Trash2
} from 'lucide-react';

interface PetsViewProps {
  pets: Pet[];
  activePet: Pet | null;
  photos: PetPhoto[];
  weightRecords: WeightRecord[];
  reminders: Reminder[];
  onSelectPet: (id: string) => void;
  onOpenAddPet: () => void;
  onOpenAddWeight: () => void;
  onOpenAddPhoto: () => void;
  onOpenHealth: () => void;
  onUpdatePet: (updated: Pet) => void;
  onEditPet?: (pet: Pet) => void;
  onDeletePet?: (petId: string) => void;
}

type ProfileTab = 'overview' | 'growth' | 'schedule';

export const PetsView: React.FC<PetsViewProps> = ({
  pets,
  activePet,
  photos,
  weightRecords,
  reminders,
  onSelectPet,
  onOpenAddPet,
  onOpenAddWeight,
  onOpenAddPhoto,
  onOpenHealth,
  onUpdatePet,
  onEditPet,
  onDeletePet
}) => {
  const [activeTab, setActiveTab] = useState<ProfileTab>('overview');
  const [beforePhotoIdx, setBeforePhotoIdx] = useState<number>(0);
  const [afterPhotoIdx, setAfterPhotoIdx] = useState<number>(photos.length > 1 ? photos.length - 1 : 0);

  if (!activePet) {
    return (
      <div className="state-container">
        <div className="state-icon">🐾</div>
        <h3 className="state-title">Chưa có hồ sơ thú cưng</h3>
        <p className="state-desc">Thêm thú cưng đầu tiên để quản lý sức khỏe và theo dõi phát triển.</p>
        <button className="btn-primary" onClick={onOpenAddPet}>
          <Plus size={18} />
          <span>Thêm thú cưng</span>
        </button>
      </div>
    );
  }

  const petPhotos = photos.filter(p => p.petId === activePet.id);
  const petWeights = weightRecords.filter(w => w.petId === activePet.id);
  const petReminders = reminders.filter(r => r.petId === activePet.id);

  return (
    <div className="pets-container animate-fade-in">
      {/* Pet Selector Tabs if multiple */}
      {pets.length > 1 && (
        <div className="pets-switch-bar">
          {pets.map(p => (
            <button
              key={p.id}
              className={`pet-pill-btn ${p.id === activePet.id ? 'active' : ''}`}
              onClick={() => onSelectPet(p.id)}
            >
              <img src={p.avatar} alt={p.name} className="pill-avatar" />
              <span>{p.name}</span>
            </button>
          ))}
          <button className="pet-pill-btn add" onClick={onOpenAddPet}>
            <Plus size={16} />
            <span>Thêm</span>
          </button>
        </div>
      )}

      {/* Main Pet Header Card */}
      <div className="pet-profile-header card">
        <div className="profile-hero-content">
          <div className="avatar-frame">
            <img src={activePet.avatar} alt={activePet.name} className="profile-large-avatar" />
            <button className="avatar-cam-btn" onClick={onOpenAddPhoto} title="Chụp ảnh mới">
              <Camera size={16} />
            </button>
          </div>

          <div className="profile-hero-info">
            <div className="name-badge-row">
              <h2 className="profile-pet-name">{activePet.name}</h2>
              <span className="badge badge-primary">
                {activePet.species === 'dog' ? 'Chó cảnh' : activePet.species === 'cat' ? 'Mèo nhà' : 'Thú cưng'}
              </span>

              {/* Action buttons: Edit & Delete */}
              <div className="pet-header-actions">
                {onEditPet && (
                  <button 
                    className="pet-action-icon-btn edit" 
                    onClick={() => onEditPet(activePet)}
                    title={`Chỉnh sửa thông tin bé ${activePet.name}`}
                  >
                    <Edit3 size={15} />
                  </button>
                )}
                {onDeletePet && (
                  <button 
                    className="pet-action-icon-btn delete" 
                    onClick={() => onDeletePet(activePet.id)}
                    title={`Xóa hồ sơ bé ${activePet.name}`}
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            </div>
            <p className="profile-breed">{activePet.breed} • {activePet.gender === 'male' ? 'Đực' : 'Cái'}</p>
            <p className="profile-age">🎂 {activePet.birthDate ? `Sinh: ${activePet.birthDate}` : `Tuổi ước tính: ${activePet.estimatedAge}`}</p>
          </div>
        </div>

        <div className="profile-stat-bar">
          <div className="stat-box">
            <span className="stat-label">Cân nặng</span>
            <span className="stat-val">{activePet.weight} kg</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-box">
            <span className="stat-label">Màu lông</span>
            <span className="stat-val">{activePet.coatColor || 'Tự nhiên'}</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-box">
            <span className="stat-label">Triệt sản</span>
            <span className="stat-val">{activePet.isNeutered ? 'Đã triệt sản' : 'Chưa'}</span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="profile-tabs-nav">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Tổng quan
        </button>
        <button 
          className={`tab-btn ${activeTab === 'growth' ? 'active' : ''}`}
          onClick={() => setActiveTab('growth')}
        >
          Phát triển & Timeline
        </button>
        <button 
          className={`tab-btn ${activeTab === 'schedule' ? 'active' : ''}`}
          onClick={() => setActiveTab('schedule')}
        >
          Lịch trình ({petReminders.length})
        </button>
      </div>

      {/* TAB 1: TỔNG QUAN */}
      {activeTab === 'overview' && (
        <div className="tab-content animate-fade-in">
          {/* Quick link to EHR */}
          <div className="ehr-link-card card" onClick={onOpenHealth}>
            <div className="ehr-link-left">
              <div className="ehr-icon-circle">
                <HeartHandshake size={22} />
              </div>
              <div>
                <h4>Sổ Sức Khỏe Điện Tử của {activePet.name}</h4>
                <p>Xem toàn bộ vaccine, lịch sử khám bệnh, đơn thuốc & dị ứng</p>
              </div>
            </div>
            <ChevronRight size={20} className="arrow-icon" />
          </div>

          {/* Detailed Info Card */}
          <div className="card info-details-card">
            <h4 className="card-section-title">Hồ sơ định danh & Thể chất</h4>

            <div className="detail-row">
              <span className="detail-label">Mã Microchip:</span>
              <span className="detail-value">{activePet.microchip || 'Chưa gắn chip'}</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Phòng khám / Bác sĩ quen:</span>
              <span className="detail-value text-primary">{activePet.preferredVet || 'Chưa cập nhật'}</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Dị ứng ghi nhận:</span>
              <div className="tags-wrap">
                {activePet.allergies && activePet.allergies.length > 0 ? (
                  activePet.allergies.map((a, i) => (
                    <span key={i} className="badge badge-emergency">{a}</span>
                  ))
                ) : (
                  <span className="detail-value">Không có</span>
                )}
              </div>
            </div>

            <div className="detail-row">
              <span className="detail-label">Bệnh nền / Tiền sử:</span>
              <div className="tags-wrap">
                {activePet.chronicConditions && activePet.chronicConditions.length > 0 ? (
                  activePet.chronicConditions.map((c, i) => (
                    <span key={i} className="badge badge-warning">{c}</span>
                  ))
                ) : (
                  <span className="detail-value">Không có bệnh lý nền</span>
                )}
              </div>
            </div>

            <div className="detail-row">
              <span className="detail-label">Thuốc đang dùng:</span>
              <div className="tags-wrap">
                {activePet.currentMedications && activePet.currentMedications.length > 0 ? (
                  activePet.currentMedications.map((m, i) => (
                    <span key={i} className="badge badge-primary">{m}</span>
                  ))
                ) : (
                  <span className="detail-value">Không sử dụng</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PHÁT TRIỂN & TIMELINE */}
      {activeTab === 'growth' && (
        <div className="tab-content animate-fade-in">
          {/* Weight Chart */}
          <WeightChart records={petWeights} />

          <div className="action-button-row">
            <button className="btn-secondary btn-sm" onClick={onOpenAddWeight}>
              <Scale size={16} />
              <span>Ghi cân nặng mới</span>
            </button>
            <button className="btn-primary btn-sm" onClick={onOpenAddPhoto}>
              <Camera size={16} />
              <span>Thêm ảnh phát triển</span>
            </button>
          </div>

          {/* Before & After Comparison */}
          {petPhotos.length >= 2 && (
            <div className="card before-after-card">
              <div className="ba-header">
                <Sparkles size={18} className="sparkle-icon" />
                <h4>So sánh ảnh "Before & After"</h4>
              </div>
              <p className="ba-desc">Xem sự thay đổi vóc dáng và thần thái của bé theo năm tháng</p>

              <div className="ba-grid">
                <div className="ba-column">
                  <span className="ba-label">Before ({petPhotos[beforePhotoIdx]?.date})</span>
                  <div className="ba-img-wrapper">
                    <img src={petPhotos[beforePhotoIdx]?.photoUrl} alt="Before" className="ba-img" />
                  </div>
                  <span className="ba-note">{petPhotos[beforePhotoIdx]?.note || 'Giai đoạn đầu'}</span>
                </div>

                <div className="ba-column">
                  <span className="ba-label">After ({petPhotos[afterPhotoIdx]?.date})</span>
                  <div className="ba-img-wrapper">
                    <img src={petPhotos[afterPhotoIdx]?.photoUrl} alt="After" className="ba-img" />
                  </div>
                  <span className="ba-note">{petPhotos[afterPhotoIdx]?.note || 'Hiện tại'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Growth Timeline: 01/01 -> 01/02 -> 01/03 */}
          <div className="card timeline-card">
            <h4 className="card-section-title">Dòng thời gian trưởng thành</h4>
            <div className="growth-timeline">
              {petPhotos.map((photo, idx) => (
                <div key={photo.id} className="timeline-node">
                  <div className="timeline-marker">
                    <div className="marker-dot" />
                    {idx < petPhotos.length - 1 && <div className="marker-line" />}
                  </div>

                  <div className="timeline-body">
                    <div className="timeline-date-chip">📅 {photo.date}</div>
                    <div className="timeline-img-box">
                      <img src={photo.photoUrl} alt={photo.note || 'Growth'} className="timeline-img" />
                    </div>
                    {photo.note && <p className="timeline-note-text">"{photo.note}"</p>}
                    {photo.weightAtTime && (
                      <span className="timeline-weight-tag">⚖️ Cân nặng lúc này: {photo.weightAtTime} kg</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Veterinary Disclaimer Alert */}
          <div className="card disclaimer-box">
            <ShieldAlert size={18} className="disclaimer-icon" />
            <p>
              <strong>Lưu ý y tế:</strong> Ảnh và chỉ số phát triển chỉ dùng để theo dõi thể trạng thường nhật. 
              PetCare không tự động đưa ra kết luận chẩn đoán bệnh tật chỉ qua hình ảnh. Khi bé có dấu hiệu bất thường, hãy tham khảo ý kiến bác sĩ thú y.
            </p>
          </div>
        </div>
      )}

      {/* TAB 3: LỊCH TRÌNH */}
      {activeTab === 'schedule' && (
        <div className="tab-content animate-fade-in">
          {petReminders.length > 0 ? (
            <div className="reminders-list">
              {petReminders.map(rem => (
                <div key={rem.id} className="reminder-item-card card">
                  <div className="reminder-icon-box teal">
                    <Calendar size={20} />
                  </div>
                  <div className="reminder-content">
                    <span className="reminder-title">{rem.title}</span>
                    <span className="reminder-time">
                      {rem.date} vào lúc {rem.time} {rem.repeat !== 'none' ? `• Lặp ${rem.repeat}` : ''}
                    </span>
                    {rem.notes && <span className="reminder-note-text">📝 {rem.notes}</span>}
                  </div>
                  <span className={`badge ${rem.priority === 'high' ? 'badge-emergency' : 'badge-primary'}`}>
                    {rem.type}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="state-container">
              <Clock size={36} className="state-icon" />
              <h4 className="state-title">Chưa có lịch hẹn cho {activePet.name}</h4>
              <p className="state-desc">Đặt lịch uống thuốc, tẩy giun hoặc cắt móng định kỳ để không quên.</p>
            </div>
          )}
        </div>
      )}

      <style>{`
        .pets-container {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .pets-switch-bar {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 4px;
        }

        .pet-pill-btn {
          min-height: 38px;
          padding: 4px 12px 4px 6px;
          border-radius: var(--radius-full);
          border: 1.5px solid var(--border-color);
          background: var(--bg-card);
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.82rem;
          color: var(--text-main);
          white-space: nowrap;
        }

        .pet-pill-btn.active {
          border-color: var(--primary);
          background: var(--primary-soft);
          color: var(--primary);
          font-weight: 700;
        }

        .pet-pill-btn.add {
          border-style: dashed;
          color: var(--primary);
        }

        .pill-avatar {
          width: 24px;
          height: 24px;
          border-radius: var(--radius-full);
          object-fit: cover;
        }

        /* Profile Header */
        .pet-profile-header {
          padding: 18px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .profile-hero-content {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .avatar-frame {
          position: relative;
        }

        .profile-large-avatar {
          width: 84px;
          height: 84px;
          border-radius: var(--radius-lg);
          object-fit: cover;
          box-shadow: var(--shadow-md);
          border: 3px solid var(--primary-light);
        }

        .avatar-cam-btn {
          position: absolute;
          bottom: -6px;
          right: -6px;
          width: 28px;
          height: 28px;
          border-radius: var(--radius-full);
          background: var(--primary);
          color: #ffffff;
          padding: 0;
          box-shadow: var(--shadow-sm);
        }

        .profile-hero-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .name-badge-row {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .pet-header-actions {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-left: auto;
        }

        .pet-action-icon-btn {
          width: 30px;
          height: 30px;
          border-radius: var(--radius-full);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          transition: all 0.2s ease;
          border: 1px solid var(--border-color);
          background: var(--bg-card);
        }

        .pet-action-icon-btn.edit {
          color: var(--primary);
        }

        .pet-action-icon-btn.edit:hover {
          background: var(--primary-soft);
          border-color: var(--primary);
          transform: scale(1.05);
        }

        .pet-action-icon-btn.delete {
          color: var(--emergency);
        }

        .pet-action-icon-btn.delete:hover {
          background: var(--emergency-soft);
          border-color: var(--emergency);
          transform: scale(1.05);
        }

        .profile-pet-name {
          font-size: 1.35rem;
        }

        .profile-breed {
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        .profile-age {
          font-size: 0.78rem;
          color: var(--text-muted);
        }

        .profile-stat-bar {
          display: flex;
          align-items: center;
          justify-content: space-around;
          background: var(--bg-main);
          padding: 10px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
        }

        .stat-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }

        .stat-label {
          font-size: 0.72rem;
          color: var(--text-muted);
        }

        .stat-val {
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--text-main);
        }

        .stat-divider {
          width: 1px;
          height: 24px;
          background: var(--border-color);
        }

        /* Profile Tabs Nav */
        .profile-tabs-nav {
          display: flex;
          background: var(--bg-card);
          border-radius: var(--radius-md);
          padding: 4px;
          border: 1px solid var(--border-color);
          gap: 4px;
        }

        .tab-btn {
          flex: 1;
          min-height: 38px;
          border-radius: var(--radius-sm);
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--text-muted);
        }

        .tab-btn.active {
          background: var(--primary);
          color: #ffffff;
        }

        /* Tab Content */
        .tab-content {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .ehr-link-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px;
          cursor: pointer;
          background: var(--primary-gradient-subtle);
          border: 1px solid var(--primary-light);
        }

        .ehr-link-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .ehr-icon-circle {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-md);
          background: #ffffff;
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--shadow-sm);
        }

        .ehr-link-card h4 {
          font-size: 0.92rem;
          margin-bottom: 2px;
        }

        .ehr-link-card p {
          font-size: 0.76rem;
          color: var(--text-muted);
        }

        .info-details-card {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .card-section-title {
          font-size: 0.95rem;
          margin-bottom: 4px;
        }

        .detail-row {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding-bottom: 8px;
          border-bottom: 1px solid var(--border-color);
        }

        .detail-row:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .detail-label {
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--text-muted);
        }

        .detail-value {
          font-size: 0.88rem;
          color: var(--text-main);
        }

        .detail-value.text-primary {
          color: var(--primary);
          font-weight: 600;
        }

        .tags-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .action-button-row {
          display: flex;
          gap: 10px;
        }

        .action-button-row button {
          flex: 1;
        }

        /* Before / After */
        .before-after-card {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .ba-header {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .sparkle-icon {
          color: var(--warning);
        }

        .ba-desc {
          font-size: 0.78rem;
          color: var(--text-muted);
        }

        .ba-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .ba-column {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .ba-label {
          font-size: 0.74rem;
          font-weight: 700;
          color: var(--primary);
        }

        .ba-img-wrapper {
          width: 100%;
          height: 140px;
          border-radius: var(--radius-md);
          overflow: hidden;
          border: 1px solid var(--border-color);
        }

        .ba-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .ba-note {
          font-size: 0.72rem;
          color: var(--text-muted);
          font-style: italic;
        }

        /* Timeline */
        .timeline-card {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .growth-timeline {
          display: flex;
          flex-direction: column;
          gap: 18px;
          position: relative;
          padding-left: 10px;
        }

        .timeline-node {
          display: flex;
          gap: 14px;
        }

        .timeline-marker {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 16px;
        }

        .marker-dot {
          width: 14px;
          height: 14px;
          border-radius: var(--radius-full);
          background: var(--primary);
          border: 3px solid var(--bg-card);
          box-shadow: 0 0 0 2px var(--primary-light);
          flex-shrink: 0;
        }

        .marker-line {
          width: 2px;
          flex: 1;
          background: var(--border-color);
          margin-top: 4px;
        }

        .timeline-body {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .timeline-date-chip {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--primary-dark);
        }

        .timeline-img-box {
          width: 100%;
          max-width: 240px;
          height: 150px;
          border-radius: var(--radius-md);
          overflow: hidden;
          border: 1px solid var(--border-color);
        }

        .timeline-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .timeline-note-text {
          font-size: 0.8rem;
          color: var(--text-main);
        }

        .timeline-weight-tag {
          font-size: 0.74rem;
          color: var(--text-muted);
        }

        .disclaimer-box {
          display: flex;
          gap: 10px;
          background: var(--warning-soft);
          border-color: rgba(245, 158, 11, 0.4);
          font-size: 0.76rem;
          line-height: 1.45;
          color: var(--text-main);
        }

        .disclaimer-icon {
          color: var(--warning);
          flex-shrink: 0;
          margin-top: 2px;
        }

        .reminder-note-text {
          font-size: 0.72rem;
          color: var(--text-muted);
          margin-top: 2px;
        }
      `}</style>
    </div>
  );
};
