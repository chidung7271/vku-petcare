import React, { useState } from 'react';
import { Pet, Reminder, HealthRecord } from '../types';
import { MainTab } from '../components/BottomNav';
import { 
  Plus, 
  Scale, 
  Calendar, 
  Camera, 
  FileText, 
  AlertTriangle, 
  Search, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  MapPin, 
  Bot, 
  ShieldAlert,
  ArrowUpRight
} from 'lucide-react';

interface HomeViewProps {
  activePet: Pet | null;
  reminders: Reminder[];
  healthRecords: HealthRecord[];
  onNavigate: (tab: MainTab) => void;
  onOpenAddPet: () => void;
  onOpenAddWeight: () => void;
  onOpenAddReminder: () => void;
  onOpenEmergencyWithQuery: (query: string) => void;
  onOpenAddPhoto: () => void;
}

const COMMON_QUESTIONS = [
  'Ăn phải chất độc',
  'Bị hóc dị vật',
  'Nôn ói liên tục',
  'Tiêu chảy ra máu',
  'Co giật',
  'Khó thở',
  'Chảy máu',
  'Bị bỏng nước sôi',
  'Bị ve / rận',
  'Bị rắn / ong cắn',
  'Bị tai nạn xe',
  'Mất tích',
  'Không chịu ăn 2 ngày',
  'Sốt cao',
  'Lờ đờ bất thường'
];

export const HomeView: React.FC<HomeViewProps> = ({
  activePet,
  reminders,
  healthRecords,
  onNavigate,
  onOpenAddPet,
  onOpenAddWeight,
  onOpenAddReminder,
  onOpenEmergencyWithQuery,
  onOpenAddPhoto
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Time of day greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Chào buổi sáng' : hour < 18 ? 'Chào buổi chiều' : 'Chào buổi tối';

  // Pet specific upcoming reminders
  const petReminders = activePet 
    ? reminders.filter(r => r.petId === activePet.id && !r.isCompleted)
    : reminders.filter(r => !r.isCompleted);

  // Vaccines upcoming
  const upcomingVaccines = healthRecords.filter(
    h => h.type === 'vaccine' && h.nextDueDate && (!activePet || h.petId === activePet.id)
  );

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onOpenEmergencyWithQuery(searchQuery);
    }
  };

  return (
    <div className="home-container animate-fade-in">
      {/* 1. Header Greeting & Active Pet Hero Card */}
      <div className="greeting-section">
        <span className="greeting-text">{greeting}, Bạn yêu pet! 🐾</span>
        <h1 className="home-title">Hôm nay {activePet ? activePet.name : 'thú cưng'} thế nào?</h1>
      </div>

      {activePet ? (
        <div className="pet-hero-card card">
          <div className="hero-top">
            <div className="hero-avatar-wrapper">
              <img src={activePet.avatar} alt={activePet.name} className="hero-avatar" />
              <span className="species-badge-mini">
                {activePet.species === 'dog' ? '🐶' : activePet.species === 'cat' ? '🐱' : '🐾'}
              </span>
            </div>

            <div className="hero-details">
              <div className="hero-name-row">
                <h2 className="hero-name">{activePet.name}</h2>
                <span className="badge badge-success">Khỏe mạnh</span>
              </div>
              <p className="hero-breed">{activePet.breed} • {activePet.gender === 'male' ? 'Đực' : 'Cái'}</p>
              
              <div className="hero-metrics">
                <div className="metric-chip">
                  <span className="label">Tuổi</span>
                  <span className="val">{activePet.estimatedAge || '1 tuổi'}</span>
                </div>
                <div className="metric-chip">
                  <span className="label">Cân nặng</span>
                  <span className="val">{activePet.weight} kg</span>
                </div>
                {activePet.isNeutered && (
                  <div className="metric-chip neutered">
                    <span className="val">Đã triệt sản</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="hero-footer">
            <button className="hero-action-btn" onClick={() => onNavigate('pets')}>
              <span>Xem sổ hồ sơ chi tiết</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      ) : (
        <div className="empty-pet-card card">
          <p>Bạn chưa thêm thú cưng nào vào PetCare.</p>
          <button className="btn-primary btn-sm" onClick={onOpenAddPet}>
            <Plus size={16} />
            <span>Thêm bé cưng ngay</span>
          </button>
        </div>
      )}

      {/* 2. "Bạn Cần Giúp Gì?" Emergency Search & Chips */}
      <div className="help-section card">
        <div className="help-header">
          <div className="help-icon-wrap">
            <ShieldAlert size={20} />
          </div>
          <div>
            <h3 className="help-title">Bạn cần giúp gì khẩn cấp?</h3>
            <span className="help-subtitle">Nhập tình huống hoặc chọn vấn đề nhanh</span>
          </div>
        </div>

        <form onSubmit={handleSearchSubmit} className="help-search-form">
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="VD: Chó nhà tôi vừa ăn phải chocolate..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="btn-primary btn-sm">Tìm</button>
          </div>
        </form>

        <div className="chip-cloud">
          {COMMON_QUESTIONS.map((item, idx) => (
            <button 
              key={idx}
              className="situation-chip"
              onClick={() => onOpenEmergencyWithQuery(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Quick Actions Grid */}
      <div className="section-block">
        <h3 className="section-title">Thao tác nhanh</h3>
        <div className="quick-actions-grid">
          <button className="quick-action-card" onClick={onOpenAddPet}>
            <div className="qa-icon teal"><Plus size={22} /></div>
            <span>+ Thêm Pet</span>
          </button>

          <button className="quick-action-card" onClick={onOpenAddWeight}>
            <div className="qa-icon blue"><Scale size={22} /></div>
            <span>Ghi Cân Nặng</span>
          </button>

          <button className="quick-action-card" onClick={onOpenAddReminder}>
            <div className="qa-icon purple"><Calendar size={22} /></div>
            <span>Thêm Lịch</span>
          </button>

          <button className="quick-action-card" onClick={onOpenAddPhoto}>
            <div className="qa-icon orange"><Camera size={22} /></div>
            <span>Chụp Ảnh</span>
          </button>

          <button className="quick-action-card" onClick={() => onNavigate('health')}>
            <div className="qa-icon green"><FileText size={22} /></div>
            <span>Sổ Sức Khỏe</span>
          </button>

          <button className="quick-action-card sos-card" onClick={() => onNavigate('emergency')}>
            <div className="qa-icon red"><AlertTriangle size={22} /></div>
            <span className="red-text">Cấp Cứu SOS</span>
          </button>
        </div>
      </div>

      {/* 4. Upcoming Reminders & Vaccine Due */}
      <div className="section-block">
        <div className="section-header-row">
          <h3 className="section-title">Lịch sắp tới & Tiêm phòng</h3>
          <button className="see-all-btn" onClick={() => onNavigate('reminders')}>Xem tất cả</button>
        </div>

        {petReminders.length > 0 || upcomingVaccines.length > 0 ? (
          <div className="reminders-list">
            {petReminders.slice(0, 2).map((rem) => (
              <div key={rem.id} className="reminder-item-card card">
                <div className="reminder-icon-box">
                  <Clock size={20} />
                </div>
                <div className="reminder-content">
                  <span className="reminder-title">{rem.title}</span>
                  <span className="reminder-time">
                    {rem.date} lúc {rem.time} • {rem.repeat !== 'none' ? `Lặp ${rem.repeat}` : 'Một lần'}
                  </span>
                </div>
                <span className={`badge ${rem.priority === 'high' ? 'badge-emergency' : 'badge-warning'}`}>
                  {rem.priority === 'high' ? 'Ưu tiên cao' : 'Nhắc nhở'}
                </span>
              </div>
            ))}

            {upcomingVaccines.slice(0, 1).map((v) => (
              <div key={v.id} className="reminder-item-card card vaccine-card">
                <div className="reminder-icon-box teal">
                  <CheckCircle2 size={20} />
                </div>
                <div className="reminder-content">
                  <span className="reminder-title">Mũi tiêm đến hạn: {v.title}</span>
                  <span className="reminder-time">Hạn tiêm nhắc: {v.nextDueDate}</span>
                </div>
                <span className="badge badge-primary">Vaccine</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="card empty-reminder-box">
            <p>Hiện không có lịch tiêm hoặc nhắc nhở nào sắp tới.</p>
            <button className="btn-outline btn-sm" onClick={onOpenAddReminder}>
              + Tạo nhắc lịch mới
            </button>
          </div>
        )}
      </div>

      {/* 5. Key Feature Shortcuts (AI, Nearest Hospital, Lost Pet) */}
      <div className="section-block">
        <h3 className="section-title">Trợ lý y tế thông minh</h3>
        <div className="feature-cards-col">
          <div className="feature-banner ai-banner card" onClick={() => onNavigate('ai')}>
            <div className="banner-left">
              <div className="banner-icon-circle blue">
                <Bot size={22} />
              </div>
              <div>
                <h4>Hỏi Bác Sĩ Thú Y AI</h4>
                <p>Hỏi đáp triệu chứng & giải đáp dinh dưỡng bằng tiếng Việt 24/7</p>
              </div>
            </div>
            <ArrowUpRight size={20} className="arrow-icon" />
          </div>

          <div className="feature-banner loc-banner card" onClick={() => onNavigate('locations')}>
            <div className="banner-left">
              <div className="banner-icon-circle teal">
                <MapPin size={22} />
              </div>
              <div>
                <h4>Tìm Bệnh Viện Thú Y Gần Nhất</h4>
                <p>Cơ sở thú y 24/7 & Cửa hàng thú cưng quanh vị trí của bạn</p>
              </div>
            </div>
            <ArrowUpRight size={20} className="arrow-icon" />
          </div>
        </div>
      </div>

      <style>{`
        .home-container {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .greeting-section {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .greeting-text {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--primary);
        }

        .home-title {
          font-size: 1.35rem;
          letter-spacing: -0.02em;
        }

        /* Pet Hero Card */
        .pet-hero-card {
          padding: 16px;
          background: var(--primary-gradient-subtle);
          border: 1.5px solid var(--primary-light);
        }

        [data-theme="dark"] .pet-hero-card {
          background: rgba(20, 154, 140, 0.12);
          border-color: rgba(45, 212, 191, 0.3);
        }

        .hero-top {
          display: flex;
          gap: 14px;
          align-items: center;
        }

        .hero-avatar-wrapper {
          position: relative;
        }

        .hero-avatar {
          width: 76px;
          height: 76px;
          border-radius: var(--radius-lg);
          object-fit: cover;
          box-shadow: var(--shadow-md);
          border: 2px solid #ffffff;
        }

        .species-badge-mini {
          position: absolute;
          bottom: -4px;
          right: -4px;
          background: #ffffff;
          border-radius: 999px;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--shadow-sm);
          font-size: 0.8rem;
        }

        .hero-details {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .hero-name-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .hero-name {
          font-size: 1.25rem;
        }

        .hero-breed {
          font-size: 0.82rem;
          color: var(--text-muted);
        }

        .hero-metrics {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 4px;
          flex-wrap: wrap;
        }

        .metric-chip {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: var(--bg-card);
          padding: 3px 8px;
          border-radius: var(--radius-full);
          border: 1px solid var(--border-color);
          font-size: 0.75rem;
        }

        .metric-chip .label {
          color: var(--text-muted);
        }

        .metric-chip .val {
          font-weight: 700;
          color: var(--text-main);
        }

        .metric-chip.neutered {
          background: var(--primary-soft);
          color: var(--primary);
          border-color: transparent;
        }

        .hero-footer {
          margin-top: 14px;
          padding-top: 10px;
          border-top: 1px solid rgba(0, 0, 0, 0.06);
        }

        .hero-action-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.85rem;
          color: var(--primary-dark);
          font-weight: 700;
          padding: 0;
          min-height: 28px;
        }

        [data-theme="dark"] .hero-action-btn {
          color: var(--primary-light);
        }

        .empty-pet-card {
          text-align: center;
          padding: 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }

        /* Help Section */
        .help-section {
          display: flex;
          flex-direction: column;
          gap: 12px;
          background: var(--bg-card);
          border-left: 4px solid var(--emergency);
        }

        .help-header {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .help-icon-wrap {
          width: 38px;
          height: 38px;
          border-radius: var(--radius-md);
          background: var(--emergency-soft);
          color: var(--emergency);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .help-title {
          font-size: 1rem;
        }

        .help-subtitle {
          font-size: 0.76rem;
          color: var(--text-muted);
        }

        .search-icon {
          color: var(--text-muted);
          flex-shrink: 0;
        }

        .chip-cloud {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .situation-chip {
          min-height: 32px;
          padding: 4px 10px;
          font-size: 0.78rem;
          font-weight: 600;
          background: var(--secondary-soft);
          color: var(--text-main);
          border-radius: var(--radius-full);
          border: 1px solid var(--border-color);
          transition: all 0.15s;
        }

        .situation-chip:hover {
          background: var(--emergency-soft);
          color: var(--emergency);
          border-color: var(--emergency-light);
        }

        /* Quick Actions */
        .section-block {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .section-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .section-title {
          font-size: 1.05rem;
        }

        .see-all-btn {
          font-size: 0.8rem;
          color: var(--primary);
          font-weight: 600;
          padding: 0;
          min-height: 24px;
        }

        .quick-actions-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }

        .quick-action-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 12px 6px;
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          min-height: 84px;
        }

        .quick-action-card span {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-main);
        }

        .quick-action-card.sos-card {
          border-color: rgba(220, 38, 38, 0.4);
        }

        .red-text {
          color: var(--emergency) !important;
        }

        .qa-icon {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .qa-icon.teal { background: #e6f7f5; color: #149a8c; }
        .qa-icon.blue { background: #eff6ff; color: #2563eb; }
        .qa-icon.purple { background: #faf5ff; color: #9333ea; }
        .qa-icon.orange { background: #fff7ed; color: #ea580c; }
        .qa-icon.green { background: #ecfdf5; color: #059669; }
        .qa-icon.red { background: #fef2f2; color: #dc2626; }

        /* Reminders */
        .reminders-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .reminder-item-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
        }

        .reminder-item-card.vaccine-card {
          border-left: 3px solid var(--primary);
        }

        .reminder-icon-box {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-sm);
          background: var(--secondary-soft);
          color: var(--text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .reminder-icon-box.teal {
          background: var(--primary-soft);
          color: var(--primary);
        }

        .reminder-content {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .reminder-title {
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--text-main);
        }

        .reminder-time {
          font-size: 0.74rem;
          color: var(--text-muted);
        }

        .empty-reminder-box {
          padding: 20px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        /* Feature banners */
        .feature-cards-col {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .feature-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px;
          cursor: pointer;
        }

        .banner-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .banner-icon-circle {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .banner-icon-circle.blue { background: #eff6ff; color: #2563eb; }
        .banner-icon-circle.teal { background: #e6f7f5; color: #149a8c; }

        .feature-banner h4 {
          font-size: 0.95rem;
          margin-bottom: 2px;
        }

        .feature-banner p {
          font-size: 0.76rem;
          color: var(--text-muted);
        }

        .arrow-icon {
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
};
