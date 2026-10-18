import React, { useState } from 'react';
import { LostPetReport, PetSpecies, PetGender } from '../types';
import { 
  Search, 
  Plus, 
  Share2, 
  Phone, 
  MapPin, 
  Calendar, 
  Download, 
  AlertTriangle, 
  HeartHandshake, 
  QrCode, 
  X,
  FileCheck
} from 'lucide-react';

interface LostPetViewProps {
  lostPets: LostPetReport[];
  onAddLostPet: (report: LostPetReport) => void;
  onShowToast: (text: string, type: 'success' | 'warning' | 'info' | 'error') => void;
}

export const LostPetView: React.FC<LostPetViewProps> = ({
  lostPets,
  onAddLostPet,
  onShowToast
}) => {
  const [activeTab, setActiveTab] = useState<'lost' | 'found'>('lost');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedPoster, setSelectedPoster] = useState<LostPetReport | null>(null);

  // New report form state
  const [petName, setPetName] = useState('');
  const [species, setSpecies] = useState<PetSpecies>('dog');
  const [breed, setBreed] = useState('');
  const [color, setColor] = useState('');
  const [gender, setGender] = useState<PetGender>('male');
  const [lastSeenLocation, setLastSeenLocation] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [reward, setReward] = useState('');
  const [notes, setNotes] = useState('');
  const [photoUrl, setPhotoUrl] = useState(
    'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80'
  );

  const filteredList = lostPets.filter(p => p.status === activeTab);

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!petName.trim() || !contactPhone.trim() || !lastSeenLocation.trim()) return;

    const newReport: LostPetReport = {
      id: 'lost_' + Date.now(),
      petName: petName.trim(),
      species,
      breed: breed.trim() || 'Chưa rõ giống',
      color: color.trim() || 'Đặc điểm tự nhiên',
      gender,
      lastSeenDate: new Date().toLocaleString([], { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
      lastSeenLocation: lastSeenLocation.trim(),
      contactPhone: contactPhone.trim(),
      reward: reward.trim() || undefined,
      notes: notes.trim() || undefined,
      photoUrl,
      status: activeTab,
      createdAt: new Date().toISOString()
    };

    onAddLostPet(newReport);
    setIsReportModalOpen(false);
    onShowToast('Đã đăng tin tìm thú cưng thành công!', 'success');
  };

  const handleSharePoster = (report: LostPetReport) => {
    const text = `[TÌM THÚ CƯNG THẤT LẠC] Bé ${report.petName} (${report.breed}, màu ${report.color}) bị lạc tại ${report.lastSeenLocation}. Xin liên hệ SĐT: ${report.contactPhone}${report.reward ? ` - Hậu tạ: ${report.reward}` : ''}`;
    if (navigator.share) {
      navigator.share({ title: 'Tìm thú cưng thất lạc', text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      onShowToast('Đã sao chép nội dung poster vào khay nhớ tạm để chia sẻ!', 'success');
    }
  };

  return (
    <div className="lostpet-container animate-fade-in">
      {/* Header Card */}
      <div className="lostpet-header card">
        <div className="lost-header-left">
          <div className="lost-icon-circle">
            <Search size={24} />
          </div>
          <div>
            <h2 className="lost-title">Mạng Lưới Tìm Thú Cưng Lạc</h2>
            <p className="lost-sub">Tự động tạo áp phích (poster) & kết nối chủ nuôi nhanh chóng</p>
          </div>
        </div>

        <button className="btn-emergency btn-sm" onClick={() => setIsReportModalOpen(true)}>
          <Plus size={16} />
          <span>Báo tin mới</span>
        </button>
      </div>

      {/* Tabs Lost vs Found */}
      <div className="tab-pill-row">
        <button 
          className={`tab-pill ${activeTab === 'lost' ? 'active' : ''}`}
          onClick={() => setActiveTab('lost')}
        >
          🚨 Thú cưng đang tìm chủ ({lostPets.filter(p => p.status === 'lost').length})
        </button>
        <button 
          className={`tab-pill ${activeTab === 'found' ? 'active' : ''}`}
          onClick={() => setActiveTab('found')}
        >
          💚 Đang được cưu mang ({lostPets.filter(p => p.status === 'found').length})
        </button>
      </div>

      {/* List of Lost / Found pets */}
      <div className="lost-cards-grid">
        {filteredList.length > 0 ? (
          filteredList.map(report => (
            <div key={report.id} className="lost-pet-card card">
              <div className="lost-img-frame">
                <img src={report.photoUrl} alt={report.petName} className="lost-pet-img" />
                <span className={`status-overlay-badge ${report.status}`}>
                  {report.status === 'lost' ? 'CẦN TÌM GẤP' : 'TÌM THẤY'}
                </span>
                {report.reward && (
                  <span className="reward-tag">🎁 Hậu tạ: {report.reward}</span>
                )}
              </div>

              <div className="lost-pet-info">
                <h3 className="lost-pet-name">{report.petName}</h3>
                <span className="lost-pet-specs">
                  {report.species === 'dog' ? 'Chó' : 'Mèo'} • {report.breed} • {report.color}
                </span>

                <div className="info-item">
                  <MapPin size={15} className="info-icon" />
                  <span>{report.lastSeenLocation}</span>
                </div>

                <div className="info-item">
                  <Calendar size={15} className="info-icon" />
                  <span>Thời gian: {report.lastSeenDate}</span>
                </div>

                {report.notes && (
                  <p className="lost-notes-preview">"{report.notes}"</p>
                )}

                <div className="lost-action-bar">
                  <a href={`tel:${report.contactPhone}`} className="btn-call-owner">
                    <Phone size={15} />
                    <span>Gọi {report.contactPhone}</span>
                  </a>

                  <button className="btn-view-poster" onClick={() => setSelectedPoster(report)}>
                    <FileCheck size={15} />
                    <span>Xem Poster</span>
                  </button>

                  <button className="btn-share-icon" onClick={() => handleSharePoster(report)}>
                    <Share2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="state-container">
            <HeartHandshake size={38} className="state-icon" />
            <h4 className="state-title">Chưa có tin báo nào trong mục này</h4>
            <p className="state-desc">Rất may mắn! Hãy cùng chung tay bảo vệ và chăm sóc an toàn cho thú cưng.</p>
          </div>
        )}
      </div>

      {/* Printable Poster Modal */}
      {selectedPoster && (
        <div className="modal-backdrop" onClick={() => setSelectedPoster(null)}>
          <div className="modal-sheet poster-modal animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Áp Phích Tìm Thú Cưng</h3>
              <button className="modal-close-btn" onClick={() => setSelectedPoster(null)}>✕</button>
            </div>

            <div className="poster-printable-area" id="printable-poster">
              <div className="poster-head-banner">
                <h1>TÌM THÚ CƯNG THẤT LẠC</h1>
                <p>XIN HÃY GIÚP GIA ĐÌNH CHÚNG TÔI ĐOÀN TỤ</p>
              </div>

              <div className="poster-photo-wrap">
                <img src={selectedPoster.photoUrl} alt={selectedPoster.petName} className="poster-img" />
              </div>

              <div className="poster-body">
                <h2 className="poster-name">{selectedPoster.petName}</h2>
                <p className="poster-breed">{selectedPoster.breed} • Màu lông: {selectedPoster.color}</p>
                
                <div className="poster-box location-box">
                  <strong>📍 KHU VỰC THẤT LẠC:</strong>
                  <p>{selectedPoster.lastSeenLocation} (lúc {selectedPoster.lastSeenDate})</p>
                </div>

                {selectedPoster.notes && (
                  <div className="poster-box">
                    <strong>ĐẶC ĐIỂM NHẬN DẠNG:</strong>
                    <p>{selectedPoster.notes}</p>
                  </div>
                )}

                {selectedPoster.reward && (
                  <div className="poster-reward-box">
                    <span className="reward-label">XIN HẬU TẠ & CẢM ƠN:</span>
                    <span className="reward-val">{selectedPoster.reward}</span>
                  </div>
                )}

                <div className="poster-contact-banner">
                  <Phone size={24} />
                  <div className="contact-numbers">
                    <span className="call-title">LIÊN HỆ KHẨN CẤP:</span>
                    <span className="phone-big">{selectedPoster.contactPhone}</span>
                  </div>
                  <div className="qr-box">
                    <QrCode size={48} />
                    <span>Quét liên hệ</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-outline" onClick={() => handleSharePoster(selectedPoster)}>
                <Share2 size={16} />
                <span>Chia sẻ ngay</span>
              </button>
              <button className="btn-primary" onClick={() => onShowToast('Đang tải poster dạng ảnh về máy của bạn...', 'info')}>
                <Download size={16} />
                <span>Tải áp phích về máy</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Report Modal */}
      {isReportModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsReportModalOpen(false)}>
          <div className="modal-sheet animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Đăng Tin Thú Cưng Thất Lạc</h3>
              <button className="modal-close-btn" onClick={() => setIsReportModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmitReport} className="modal-body">
              <div className="input-group">
                <label className="input-label">Tên thú cưng *</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="VD: Bơ, Milo..." 
                  value={petName} 
                  onChange={e => setPetName(e.target.value)} 
                  required 
                />
              </div>

              <div className="grid-2">
                <div className="input-group">
                  <label className="input-label">Giống loài</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="VD: Corgi, Poodle..." 
                    value={breed} 
                    onChange={e => setBreed(e.target.value)} 
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">Màu lông</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="VD: Vàng trắng..." 
                    value={color} 
                    onChange={e => setColor(e.target.value)} 
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Khu vực thất lạc *</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="Số nhà, tên đường, công viên, quận/huyện..." 
                  value={lastSeenLocation} 
                  onChange={e => setLastSeenLocation(e.target.value)} 
                  required 
                />
              </div>

              <div className="input-group">
                <label className="input-label">Số điện thoại liên hệ *</label>
                <input 
                  type="tel" 
                  className="input-field" 
                  placeholder="0988 xxx xxx" 
                  value={contactPhone} 
                  onChange={e => setContactPhone(e.target.value)} 
                  required 
                />
              </div>

              <div className="input-group">
                <label className="input-label">Phần thưởng / Hậu tạ (nếu có)</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="VD: 5.000.000 VNĐ..." 
                  value={reward} 
                  onChange={e => setReward(e.target.value)} 
                />
              </div>

              <div className="input-group">
                <label className="input-label">Đặc điểm nhận dạng / Ghi chú</label>
                <textarea 
                  className="textarea-field" 
                  placeholder="Vòng cổ màu gì, bé có nhát người không, tiếng gọi quen thuộc..." 
                  value={notes} 
                  onChange={e => setNotes(e.target.value)} 
                />
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-outline" onClick={() => setIsReportModalOpen(false)}>Hủy</button>
                <button type="submit" className="btn-emergency">Đăng tin & Tạo Poster</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .lostpet-container {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .lostpet-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 16px;
          background: var(--primary-gradient-subtle);
          border: 1px solid var(--primary-light);
        }

        .lost-header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .lost-icon-circle {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-md);
          background: var(--emergency);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .lost-title {
          font-size: 1.05rem;
        }

        .lost-sub {
          font-size: 0.74rem;
          color: var(--text-muted);
        }

        .tab-pill-row {
          display: flex;
          gap: 8px;
        }

        .tab-pill {
          flex: 1;
          min-height: 40px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
          background: var(--bg-card);
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-muted);
        }

        .tab-pill.active {
          background: var(--emergency);
          color: #ffffff;
          border-color: var(--emergency);
        }

        .lost-cards-grid {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .lost-pet-card {
          padding: 0;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .lost-img-frame {
          width: 100%;
          height: 200px;
          position: relative;
        }

        .lost-pet-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .status-overlay-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          padding: 4px 10px;
          border-radius: var(--radius-full);
          font-size: 0.72rem;
          font-weight: 800;
          color: #ffffff;
        }

        .status-overlay-badge.lost {
          background: var(--emergency);
          box-shadow: 0 2px 8px rgba(220, 38, 38, 0.4);
        }

        .status-overlay-badge.found {
          background: #10b981;
        }

        .reward-tag {
          position: absolute;
          bottom: 10px;
          left: 10px;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(4px);
          color: #fbbf24;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: var(--radius-full);
        }

        .lost-pet-info {
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .lost-pet-name {
          font-size: 1.15rem;
        }

        .lost-pet-specs {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
          color: var(--text-main);
        }

        .info-icon {
          color: var(--primary);
          flex-shrink: 0;
        }

        .lost-notes-preview {
          font-size: 0.78rem;
          color: var(--text-muted);
          font-style: italic;
          margin-top: 4px;
        }

        .lost-action-bar {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 10px;
        }

        .btn-call-owner {
          flex: 1;
          min-height: 38px;
          background: var(--primary);
          color: #ffffff;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: 0.8rem;
          font-weight: 700;
          text-decoration: none;
        }

        .btn-view-poster {
          min-height: 38px;
          padding: 0 12px;
          background: var(--secondary-soft);
          color: var(--secondary);
          border-radius: var(--radius-md);
          font-size: 0.78rem;
          font-weight: 700;
          border: 1px solid var(--border-color);
        }

        [data-theme="dark"] .btn-view-poster {
          color: var(--primary-light);
        }

        .btn-share-icon {
          width: 38px;
          height: 38px;
          border-radius: var(--radius-md);
          background: var(--secondary-soft);
          color: var(--text-main);
          padding: 0;
          border: 1px solid var(--border-color);
        }

        /* Printable Poster */
        .poster-printable-area {
          background: #ffffff;
          color: #0f172a;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          border: 3px solid #dc2626;
        }

        .poster-head-banner {
          background: #dc2626;
          color: #ffffff;
          text-align: center;
          padding: 10px;
          border-radius: 4px;
        }

        .poster-head-banner h1 {
          font-size: 1.25rem;
          color: #ffffff;
          letter-spacing: 0.04em;
        }

        .poster-head-banner p {
          font-size: 0.72rem;
          font-weight: 700;
        }

        .poster-photo-wrap {
          width: 100%;
          height: 220px;
          border-radius: 8px;
          overflow: hidden;
          border: 2px solid #e2e8f0;
        }

        .poster-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .poster-body {
          display: flex;
          flex-direction: column;
          gap: 8px;
          text-align: center;
        }

        .poster-name {
          font-size: 1.5rem;
          color: #dc2626;
        }

        .poster-breed {
          font-size: 0.9rem;
          font-weight: 600;
        }

        .poster-box {
          background: #f8fafc;
          padding: 8px;
          border-radius: 6px;
          font-size: 0.8rem;
          text-align: left;
          border: 1px solid #e2e8f0;
        }

        .poster-reward-box {
          background: #fef3c7;
          border: 2px dashed #f59e0b;
          padding: 10px;
          border-radius: 6px;
          display: flex;
          flex-direction: column;
        }

        .reward-label {
          font-size: 0.75rem;
          font-weight: 800;
          color: #92400e;
        }

        .reward-val {
          font-size: 1.25rem;
          font-weight: 800;
          color: #b45309;
        }

        .poster-contact-banner {
          background: #dc2626;
          color: #ffffff;
          padding: 12px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          text-align: left;
        }

        .call-title {
          font-size: 0.72rem;
          font-weight: 700;
          opacity: 0.9;
        }

        .phone-big {
          font-size: 1.15rem;
          font-weight: 800;
        }

        .qr-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          font-size: 0.65rem;
          gap: 2px;
        }
      `}</style>
    </div>
  );
};
