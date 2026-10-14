import React, { useState } from 'react';
import { 
  Home, 
  Heart, 
  Activity, 
  AlertOctagon, 
  Users, 
  MapPin, 
  Bot, 
  Search, 
  Bell, 
  BookOpen, 
  Video, 
  Settings, 
  Grid 
} from 'lucide-react';

export type MainTab = 
  | 'home' 
  | 'pets' 
  | 'health' 
  | 'emergency' 
  | 'community' 
  | 'locations' 
  | 'ai' 
  | 'lost_pet' 
  | 'reminders' 
  | 'knowledge' 
  | 'videos' 
  | 'settings';

interface BottomNavProps {
  activeTab: MainTab;
  onTabChange: (tab: MainTab) => void;
  unreadRemindersCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  unreadRemindersCount = 0
}) => {
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const handleSelectTab = (tab: MainTab) => {
    onTabChange(tab);
    setShowMoreMenu(false);
  };

  return (
    <>
      {/* Expanded More Menu Drawer */}
      {showMoreMenu && (
        <div className="more-menu-overlay" onClick={() => setShowMoreMenu(false)}>
          <div className="more-menu-content animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="more-menu-header">
              <span className="title">Chức năng nâng cao</span>
              <span className="subtitle">Tất cả tiện ích chăm sóc</span>
            </div>

            <div className="menu-grid">
              <button 
                className={`menu-grid-item ${activeTab === 'locations' ? 'active' : ''}`}
                onClick={() => handleSelectTab('locations')}
              >
                <div className="item-icon-wrap teal"><MapPin size={22} /></div>
                <span>Bệnh viện Thú Y</span>
              </button>

              <button 
                className={`menu-grid-item ${activeTab === 'ai' ? 'active' : ''}`}
                onClick={() => handleSelectTab('ai')}
              >
                <div className="item-icon-wrap blue"><Bot size={22} /></div>
                <span>AI Health Bác Sĩ</span>
              </button>

              <button 
                className={`menu-grid-item ${activeTab === 'lost_pet' ? 'active' : ''}`}
                onClick={() => handleSelectTab('lost_pet')}
              >
                <div className="item-icon-wrap orange"><Search size={22} /></div>
                <span>Thú Cưng Lạc</span>
              </button>

              <button 
                className={`menu-grid-item ${activeTab === 'reminders' ? 'active' : ''}`}
                onClick={() => handleSelectTab('reminders')}
              >
                <div className="item-icon-wrap purple">
                  <Bell size={22} />
                  {unreadRemindersCount > 0 && <span className="mini-badge">{unreadRemindersCount}</span>}
                </div>
                <span>Nhắc Lịch Hẹn</span>
              </button>

              <button 
                className={`menu-grid-item ${activeTab === 'community' ? 'active' : ''}`}
                onClick={() => handleSelectTab('community')}
              >
                <div className="item-icon-wrap red"><Video size={22} /></div>
                <span>Blog & Video</span>
              </button>

              <button 
                className={`menu-grid-item ${activeTab === 'settings' ? 'active' : ''}`}
                onClick={() => handleSelectTab('settings')}
              >
                <div className="item-icon-wrap gray"><Settings size={22} /></div>
                <span>Cài Đặt & Hồ Sơ</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main 5-Item Bottom Bar */}
      <nav className="bottom-nav-bar">
        <button
          className={`nav-btn ${activeTab === 'home' ? 'active' : ''}`}
          onClick={() => handleSelectTab('home')}
        >
          <Home size={22} />
          <span className="nav-label">Trang chủ</span>
        </button>

        <button
          className={`nav-btn ${activeTab === 'pets' ? 'active' : ''}`}
          onClick={() => handleSelectTab('pets')}
        >
          <Heart size={22} />
          <span className="nav-label">Thú cưng</span>
        </button>

        {/* Emergency SOS Center Button */}
        <button
          className={`nav-btn-emergency ${activeTab === 'emergency' ? 'active' : ''}`}
          onClick={() => handleSelectTab('emergency')}
          aria-label="Cấp cứu khẩn cấp"
        >
          <div className="emergency-icon-circle">
            <AlertOctagon size={24} />
          </div>
          <span className="nav-label-emergency">Khẩn Cấp</span>
        </button>

        <button
          className={`nav-btn ${activeTab === 'health' ? 'active' : ''}`}
          onClick={() => handleSelectTab('health')}
        >
          <Activity size={22} />
          <span className="nav-label">Sức khỏe</span>
        </button>

        <button
          className={`nav-btn ${activeTab === 'community' || showMoreMenu ? 'active' : ''}`}
          onClick={() => setShowMoreMenu(!showMoreMenu)}
        >
          {showMoreMenu ? <Grid size={22} /> : <Users size={22} />}
          <span className="nav-label">{showMoreMenu ? 'Đóng' : 'Cộng đồng'}</span>
        </button>
      </nav>

      <style>{`
        .bottom-nav-bar {
          position: fixed;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          max-width: var(--max-app-width);
          height: calc(var(--nav-height) + env(safe-area-inset-bottom, 0px));
          padding-bottom: env(safe-area-inset-bottom, 0px);
          background: var(--bg-card);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-top: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: space-around;
          z-index: 60;
          box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.05);
        }

        .nav-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 3px;
          min-height: 48px;
          padding: 4px 10px;
          color: var(--text-muted);
          border-radius: var(--radius-sm);
          flex: 1;
        }

        .nav-btn:hover {
          color: var(--primary);
        }

        .nav-btn.active {
          color: var(--primary);
          font-weight: 700;
        }

        .nav-label {
          font-size: 0.7rem;
          font-weight: 600;
        }

        /* Center Emergency Button */
        .nav-btn-emergency {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          top: -12px;
          flex: 1;
        }

        .emergency-icon-circle {
          width: 46px;
          height: 46px;
          border-radius: var(--radius-full);
          background: var(--emergency);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--shadow-emergency);
          animation: pulse-emergency 2.5s infinite;
          border: 3px solid var(--bg-card);
          transition: transform 0.2s;
        }

        .nav-btn-emergency:active .emergency-icon-circle {
          transform: scale(0.92);
        }

        .nav-label-emergency {
          font-size: 0.72rem;
          font-weight: 800;
          color: var(--emergency);
          margin-top: 2px;
        }

        /* More Menu Overlay */
        .more-menu-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.45);
          backdrop-filter: blur(4px);
          z-index: 55;
          display: flex;
          align-items: flex-end;
          justify-content: center;
        }

        .more-menu-content {
          width: 100%;
          max-width: var(--max-app-width);
          background: var(--bg-card);
          border-top-left-radius: var(--radius-xl);
          border-top-right-radius: var(--radius-xl);
          padding: 20px 18px calc(var(--nav-height) + 20px);
          box-shadow: var(--shadow-xl);
          border-top: 1px solid var(--border-color);
        }

        .more-menu-header {
          margin-bottom: 16px;
          display: flex;
          flex-direction: column;
        }

        .more-menu-header .title {
          font-family: var(--font-display);
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text-main);
        }

        .more-menu-header .subtitle {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .menu-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .menu-grid-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 6px;
          background: var(--bg-main);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          min-height: 84px;
        }

        .menu-grid-item span {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-main);
          text-align: center;
          line-height: 1.2;
        }

        .menu-grid-item:hover, .menu-grid-item.active {
          border-color: var(--primary);
          background: var(--primary-soft);
        }

        .item-icon-wrap {
          width: 42px;
          height: 42px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .item-icon-wrap.teal { background: #e6f7f5; color: #149a8c; }
        .item-icon-wrap.blue { background: #eff6ff; color: #2563eb; }
        .item-icon-wrap.orange { background: #fff7ed; color: #ea580c; }
        .item-icon-wrap.purple { background: #faf5ff; color: #9333ea; }
        .item-icon-wrap.green { background: #ecfdf5; color: #059669; }
        .item-icon-wrap.red { background: #fef2f2; color: #dc2626; }
        .item-icon-wrap.gray { background: #f1f5f9; color: #475569; }

        .mini-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          background: var(--emergency);
          color: #ffffff;
          font-size: 0.65rem;
          font-weight: 800;
          border-radius: 999px;
          padding: 1px 5px;
        }
      `}</style>
    </>
  );
};
