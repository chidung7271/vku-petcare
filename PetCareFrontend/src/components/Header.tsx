import React, { useState } from 'react';
import { Pet } from '../types';
import { ChevronDown, Moon, Sun, PlusCircle, Check, ArrowLeft, PhoneCall, LogIn, Edit3 } from 'lucide-react';

interface HeaderProps {
  pets: Pet[];
  activePet: Pet | null;
  onSelectPet: (petId: string) => void;
  onOpenAddPet: () => void;
  onEditPet?: (pet: Pet) => void;
  emergencyPhone?: string;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  canGoBack?: boolean;
  onGoBack?: () => void;
  currentTabTitle?: string;
  isLoggedIn?: boolean;
  onOpenAuthModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  pets,
  activePet,
  onSelectPet,
  onOpenAddPet,
  onEditPet,
  emergencyPhone = '19008668',
  theme,
  onToggleTheme,
  canGoBack,
  onGoBack,
  currentTabTitle,
  isLoggedIn,
  onOpenAuthModal
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  // Clean phone number for tel: protocol
  const telNumber = (emergencyPhone || '19008668').replace(/[^\d+]/g, '');

  return (
    <header className="app-header">
      <div className="header-left">
        {/* Navigation Back Button */}
        {canGoBack && onGoBack && (
          <button 
            className="header-back-btn animate-fade-in"
            onClick={onGoBack}
            aria-label="Quay lại trang trước"
            title="Quay lại trang trước"
          >
            <ArrowLeft size={18} />
            <span className="back-label-text">Quay lại</span>
          </button>
        )}

        <div className="brand-badge">
          <img src="/logo.png" alt="PetCare" className="header-logo" />
          <div className="brand-text">
            <span className="brand-name">PetCare</span>
            <span className="brand-slogan">{currentTabTitle || 'Healthy Pets • Happy Lives'}</span>
          </div>
        </div>
      </div>

      <div className="header-right">
        {/* Active Pet Selector */}
        {activePet && (
          <div className="pet-selector-wrapper">
            <button 
              className="pet-selector-btn"
              onClick={() => setShowDropdown(!showDropdown)}
              aria-label="Chọn thú cưng"
            >
              <img 
                src={activePet.avatar} 
                alt={activePet.name} 
                className="pet-avatar-mini"
              />
              <span className="pet-name-label">{activePet.name}</span>
              <ChevronDown size={14} className={`dropdown-arrow ${showDropdown ? 'rotate' : ''}`} />
            </button>

            {showDropdown && (
              <div className="pet-dropdown-menu animate-fade-in">
                <div className="dropdown-header">Thú cưng của bạn</div>
                {pets.map((pet) => (
                  <div
                    key={pet.id}
                    className={`dropdown-item ${pet.id === activePet.id ? 'active' : ''}`}
                    onClick={() => {
                      onSelectPet(pet.id);
                      setShowDropdown(false);
                    }}
                  >
                    <img src={pet.avatar} alt={pet.name} className="dropdown-avatar" />
                    <div className="dropdown-pet-info">
                      <span className="name">{pet.name}</span>
                      <span className="breed">{pet.breed}</span>
                    </div>
                    {onEditPet && (
                      <button
                        className="dropdown-edit-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowDropdown(false);
                          onEditPet(pet);
                        }}
                        title={`Sửa thông tin ${pet.name}`}
                      >
                        <Edit3 size={13} />
                      </button>
                    )}
                    {pet.id === activePet.id && <Check size={16} className="check-icon" />}
                  </div>
                ))}
                <button
                  className="dropdown-add-btn"
                  onClick={() => {
                    setShowDropdown(false);
                    onOpenAddPet();
                  }}
                >
                  <PlusCircle size={16} />
                  <span>Thêm thú cưng mới</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Direct Emergency Call Button (Tapping immediately makes the phone call) */}
        <a 
          href={`tel:${telNumber}`}
          className="header-sos-call-btn"
          aria-label={`Gọi cấp cứu khẩn cấp: ${emergencyPhone}`}
          title={`Gọi cấp cứu khẩn cấp: ${emergencyPhone}`}
        >
          <PhoneCall size={15} className="phone-pulse-icon" />
          <span className="sos-call-text">Gọi SOS</span>
        </a>

        {/* Guest Login Shortcut */}
        {!isLoggedIn && onOpenAuthModal && (
          <button 
            className="header-login-btn animate-fade-in"
            onClick={onOpenAuthModal}
            title="Đăng nhập tài khoản"
          >
            <LogIn size={14} />
            <span className="header-login-text">Đăng nhập</span>
          </button>
        )}

        {/* Theme Toggle */}
        <button
          className="theme-toggle-btn"
          onClick={onToggleTheme}
          aria-label={theme === 'dark' ? 'Chuyển sang nền sáng' : 'Chuyển sang nền tối'}
          title="Đổi giao diện Sáng / Tối"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      <style>{`
        .app-header {
          position: sticky;
          top: 0;
          z-index: 50;
          height: calc(var(--header-height) + env(safe-area-inset-top, 0px));
          padding-top: env(safe-area-inset-top, 0px);
          background: var(--bg-card);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-left: calc(14px + env(safe-area-inset-left, 0px));
          padding-right: calc(14px + env(safe-area-inset-right, 0px));
          gap: 8px;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .brand-badge {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .header-logo {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          object-fit: cover;
          box-shadow: 0 2px 6px rgba(20, 154, 140, 0.25);
        }

        .brand-text {
          display: flex;
          flex-direction: column;
        }

        .brand-name {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: 1.15rem;
          color: var(--primary);
          line-height: 1.1;
          letter-spacing: -0.02em;
        }

        .brand-slogan {
          font-size: 0.65rem;
          font-weight: 600;
          color: var(--secondary);
          opacity: 0.8;
          letter-spacing: 0.02em;
        }

        [data-theme="dark"] .brand-slogan {
          color: var(--primary-light);
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .pet-selector-wrapper {
          position: relative;
        }

        .pet-selector-btn {
          min-height: 34px;
          padding: 3px 8px 3px 4px;
          background: var(--bg-main);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .pet-avatar-mini {
          width: 26px;
          height: 26px;
          border-radius: var(--radius-full);
          object-fit: cover;
        }

        .pet-name-label {
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--text-main);
          max-width: 65px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .dropdown-arrow {
          color: var(--text-muted);
          transition: transform 0.2s ease;
        }

        .dropdown-arrow.rotate {
          transform: rotate(180deg);
        }

        .pet-dropdown-menu {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          width: 220px;
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-xl);
          padding: 8px;
          z-index: 100;
        }

        .dropdown-header {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 6px 8px;
        }

        .dropdown-item {
          width: 100%;
          min-height: 42px;
          padding: 6px 8px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          gap: 10px;
          justify-content: flex-start;
          text-align: left;
          cursor: pointer;
          user-select: none;
        }

        .dropdown-item:hover, .dropdown-item.active {
          background: var(--primary-soft);
        }

        .dropdown-edit-btn {
          width: 24px;
          height: 24px;
          border-radius: var(--radius-full);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          padding: 0;
          opacity: 0.6;
          transition: all 0.2s ease;
        }

        .dropdown-edit-btn:hover {
          opacity: 1;
          color: var(--primary);
          background: rgba(20, 154, 140, 0.15);
        }

        .dropdown-avatar {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-full);
          object-fit: cover;
        }

        .dropdown-pet-info {
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .dropdown-pet-info .name {
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--text-main);
        }

        .dropdown-pet-info .breed {
          font-size: 0.72rem;
          color: var(--text-muted);
        }

        .check-icon {
          color: var(--primary);
        }

        .dropdown-add-btn {
          width: 100%;
          min-height: 38px;
          margin-top: 6px;
          border-top: 1px solid var(--border-color);
          padding-top: 8px;
          color: var(--primary);
          font-size: 0.82rem;
          font-weight: 600;
          justify-content: center;
        }

        .header-back-btn {
          min-height: 34px;
          padding: 0 8px;
          border-radius: var(--radius-full);
          background: var(--bg-main);
          border: 1px solid var(--border-color);
          color: var(--text-main);
          display: inline-flex;
          align-items: center;
          gap: 4px;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.78rem;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .header-back-btn:hover {
          background: var(--primary-soft);
          color: var(--primary);
          border-color: var(--primary);
        }

        @media (max-width: 480px) {
          .back-label-text {
            display: none;
          }
          .header-back-btn {
            width: 34px;
            padding: 0;
            justify-content: center;
          }
        }

        .header-sos-call-btn {
          min-height: 34px;
          padding: 0 10px;
          border-radius: var(--radius-full);
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: #ffffff;
          font-size: 0.78rem;
          font-weight: 800;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          border: none;
          cursor: pointer;
          text-decoration: none;
          box-shadow: 0 2px 8px rgba(220, 38, 38, 0.35);
          animation: pulse-emergency 2.5s infinite;
          flex-shrink: 0;
          transition: transform 0.15s ease;
        }

        .header-sos-call-btn:active {
          transform: scale(0.96);
        }

        .phone-pulse-icon {
          animation: pulse 1.5s infinite;
        }

        .header-login-btn {
          min-height: 34px;
          padding: 0 10px;
          border-radius: var(--radius-full);
          background: var(--primary-soft);
          border: 1px solid var(--primary);
          color: var(--primary);
          font-size: 0.78rem;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          cursor: pointer;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .header-login-btn:hover {
          background: var(--primary);
          color: #ffffff;
        }

        @media (max-width: 480px) {
          .header-login-text {
            display: none;
          }
          .header-login-btn {
            width: 34px;
            padding: 0;
            justify-content: center;
          }
        }

        .theme-toggle-btn {
          min-height: 34px;
          width: 34px;
          padding: 0;
          border-radius: var(--radius-full);
          background: var(--bg-main);
          border: 1px solid var(--border-color);
          color: var(--text-main);
        }
      `}</style>
    </header>
  );
};
