import React, { useState } from 'react';
import { UserProfile, Pet } from '../types';
import { 
  Settings, 
  User, 
  Bell, 
  MapPin, 
  Moon, 
  Sun, 
  Download, 
  RotateCcw, 
  ShieldCheck, 
  FileText, 
  Info, 
  ChevronRight, 
  Heart,
  PlusCircle,
  PhoneCall,
  Phone,
  Check,
  Edit2,
  LogIn,
  LogOut
} from 'lucide-react';

interface SettingsViewProps {
  user: UserProfile;
  pets: Pet[];
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onUpdateUser: (u: UserProfile) => void;
  onOpenAddPet: () => void;
  onResetData: () => void;
  onShowToast: (text: string, type: 'success' | 'warning' | 'info' | 'error') => void;
  onOpenAuthModal?: (mode?: 'login' | 'register') => void;
  onLogout?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  pets,
  theme,
  onToggleTheme,
  onUpdateUser,
  onOpenAddPet,
  onResetData,
  onShowToast,
  onOpenAuthModal,
  onLogout
}) => {
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [notifState, setNotifState] = useState(
    'Notification' in window ? Notification.permission : 'unsupported'
  );

  // Emergency contact settings
  const [isEditingEmergency, setIsEditingEmergency] = useState(false);
  const [emergencyName, setEmergencyName] = useState(user.emergencyContactName || 'BS. Nam (Bệnh Viện Thú Y PetHealth)');
  const [emergencyPhone, setEmergencyPhone] = useState(user.emergencyContact || '0988 765 432');

  const handleSaveEmergency = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emergencyPhone.trim()) {
      onShowToast('Vui lòng nhập số điện thoại cấp cứu', 'warning');
      return;
    }
    const updated: UserProfile = {
      ...user,
      emergencyContact: emergencyPhone.trim(),
      emergencyContactName: emergencyName.trim() || 'Bác sĩ thú y riêng'
    };
    onUpdateUser(updated);
    setIsEditingEmergency(false);
    onShowToast('Đã lưu số điện thoại cấp cứu vào hồ sơ!', 'success');
  };

  const handleRequestNotif = async () => {
    if ('Notification' in window) {
      const res = await Notification.requestPermission();
      setNotifState(res);
      onShowToast(`Quyền thông báo: ${res === 'granted' ? 'Đã bật' : 'Chưa cấp'}`, res === 'granted' ? 'success' : 'warning');
    } else {
      onShowToast('Trình duyệt không hỗ trợ thông báo đẩy.', 'warning');
    }
  };

  const handleExportData = () => {
    const backup = {
      pets: localStorage.getItem('petcare_pets'),
      health: localStorage.getItem('petcare_health_records'),
      weights: localStorage.getItem('petcare_weight_records'),
      reminders: localStorage.getItem('petcare_reminders'),
      exportedAt: new Date().toISOString()
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2));
    const a = document.createElement('a');
    a.setAttribute('href', dataStr);
    a.setAttribute('download', `petcare_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(a);
    a.click();
    a.remove();
    onShowToast('Đã xuất toàn bộ hồ sơ thú cưng thành file JSON!', 'success');
  };

  return (
    <div className="settings-container animate-fade-in">
      {/* User Header Profile */}
      <div className="user-profile-card card">
        <img src={user.avatar} alt={user.name} className="user-avatar" />
        <div className="user-info">
          <div className="user-name-row">
            <h3 className="user-name">{user.name}</h3>
            {user.isLoggedIn ? (
              <span className="auth-badge verified">Đã đăng nhập</span>
            ) : (
              <span className="auth-badge guest">Khách vãng lai</span>
            )}
          </div>
          <p className="user-email">{user.email}</p>
          <span className="user-phone">📞 Số liên hệ: {user.phone || 'Chưa cập nhật'}</span>
        </div>

        <div className="user-auth-action">
          {user.isLoggedIn ? (
            <button 
              type="button"
              className="btn-auth-logout"
              onClick={onLogout}
              title="Đăng xuất tài khoản"
            >
              <LogOut size={14} />
              <span>Đăng xuất</span>
            </button>
          ) : (
            <button 
              type="button"
              className="btn-auth-login"
              onClick={() => onOpenAuthModal && onOpenAuthModal('login')}
              title="Đăng nhập tài khoản"
            >
              <LogIn size={14} />
              <span>Đăng nhập</span>
            </button>
          )}
        </div>
      </div>

      {/* Emergency Contact & Vet Section */}
      <div className="settings-block">
        <div className="block-head-row">
          <h4 className="block-title">🚨 Liên Hệ Cấp Cứu & Bác Sĩ Riêng</h4>
          <button 
            className="btn-outline btn-sm" 
            style={{ fontSize: '0.78rem', padding: '4px 10px' }}
            onClick={() => setIsEditingEmergency(!isEditingEmergency)}
          >
            {isEditingEmergency ? 'Đóng' : <><Edit2 size={13} style={{ marginRight: '4px' }} /> Thay đổi</>}
          </button>
        </div>

        <div className="card emergency-setting-box">
          {isEditingEmergency ? (
            <form onSubmit={handleSaveEmergency} className="emergency-form animate-fade-in">
              <div className="form-group" style={{ marginBottom: '10px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Tên Bác sĩ / Phòng khám quen thuộc:
                </label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="VD: BS. Nam (Bệnh Viện Thú Y PetHealth)" 
                  value={emergencyName}
                  onChange={e => setEmergencyName(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-main)' }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Số điện thoại khẩn cấp * (Dùng khi bấm nút Gọi SOS trên Header):
                </label>
                <input 
                  type="tel" 
                  className="form-input" 
                  placeholder="VD: 0988 765 432" 
                  value={emergencyPhone}
                  onChange={e => setEmergencyPhone(e.target.value)}
                  required
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-main)', fontWeight: 700 }}
                />
              </div>

              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button 
                  type="button" 
                  className="btn-outline btn-sm" 
                  onClick={() => setIsEditingEmergency(false)}
                >
                  Hủy
                </button>
                <button 
                  type="submit" 
                  className="btn-primary btn-sm"
                  style={{ background: '#dc2626', borderColor: '#dc2626', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  <Check size={14} />
                  <span>Lưu số cấp cứu</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="emergency-preview-row">
              <div className="emergency-preview-left">
                <div className="vet-badge-icon">
                  <PhoneCall size={20} className="icon-emergency" />
                </div>
                <div className="vet-preview-text">
                  <div className="preview-title">{user.emergencyContactName || 'Bác sĩ thú y riêng'}</div>
                  <div className="preview-phone">{user.emergencyContact || 'Chưa thiết lập số điện thoại'}</div>
                  <span className="preview-hint">Dùng khi bấm nút "Gọi SOS" trên thanh Header</span>
                </div>
              </div>

              {user.emergencyContact && (
                <a 
                  href={`tel:${user.emergencyContact.replace(/\s+/g, '')}`} 
                  className="btn-call-test"
                  title="Gọi thử số này"
                >
                  <Phone size={14} />
                  <span>Gọi thử</span>
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Pet Management List */}
      <div className="settings-block">
        <div className="block-head-row">
          <h4 className="block-title">Danh sách thú cưng ({pets.length})</h4>
          <button className="btn-primary btn-sm" onClick={onOpenAddPet}>
            <PlusCircle size={15} />
            <span>Thêm bé mới</span>
          </button>
        </div>

        <div className="pets-mini-list card">
          {pets.map(p => (
            <div key={p.id} className="pet-mini-item">
              <img src={p.avatar} alt={p.name} className="p-avatar" />
              <div className="p-text">
                <span className="p-name">{p.name}</span>
                <span className="p-sub">{p.breed} • {p.weight} kg</span>
              </div>
              <span className="badge badge-primary">{p.species}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Preferences & System */}
      <div className="settings-block">
        <h4 className="block-title">Cài đặt hệ thống & Giao diện</h4>
        <div className="card settings-list-card">
          <div className="setting-row">
            <div className="setting-row-left">
              {theme === 'dark' ? <Moon size={20} className="icon-blue" /> : <Sun size={20} className="icon-orange" />}
              <div>
                <span className="setting-name">Giao diện Sáng / Tối</span>
                <span className="setting-sub">Đang dùng chế độ {theme === 'dark' ? 'Nền tối (Dark)' : 'Nền sáng (Light)'}</span>
              </div>
            </div>
            <button className="btn-outline btn-sm" onClick={onToggleTheme}>
              {theme === 'dark' ? 'Bật Nền Sáng' : 'Bật Nền Tối'}
            </button>
          </div>

          <div className="setting-row">
            <div className="setting-row-left">
              <Bell size={20} className="icon-purple" />
              <div>
                <span className="setting-name">Thông báo nhắc lịch</span>
                <span className="setting-sub">Trạng thái: {notifState === 'granted' ? 'Đã cho phép' : 'Chưa bật'}</span>
              </div>
            </div>
            <button className="btn-outline btn-sm" onClick={handleRequestNotif}>
              {notifState === 'granted' ? 'Đã cấp quyền' : 'Kích hoạt'}
            </button>
          </div>

          <div className="setting-row">
            <div className="setting-row-left">
              <Download size={20} className="icon-green" />
              <div>
                <span className="setting-name">Sao lưu dữ liệu (Export)</span>
                <span className="setting-sub">Tải toàn bộ y bạ & cân nặng về máy</span>
              </div>
            </div>
            <button className="btn-outline btn-sm" onClick={handleExportData}>
              Xuất JSON
            </button>
          </div>
        </div>
      </div>

      {/* Safety & Legal */}
      <div className="settings-block">
        <h4 className="block-title">Pháp lý & Quyền riêng tư</h4>
        <div className="card settings-list-card">
          <div className="setting-row clickable" onClick={() => setShowPrivacy(true)}>
            <div className="setting-row-left">
              <ShieldCheck size={20} className="icon-teal" />
              <span className="setting-name">Chính sách quyền riêng tư</span>
            </div>
            <ChevronRight size={18} className="arrow-muted" />
          </div>

          <div className="setting-row clickable" onClick={() => setShowTerms(true)}>
            <div className="setting-row-left">
              <FileText size={20} className="icon-blue" />
              <span className="setting-name">Điều khoản dịch vụ y tế</span>
            </div>
            <ChevronRight size={18} className="arrow-muted" />
          </div>

          <div className="setting-row clickable" onClick={onResetData}>
            <div className="setting-row-left">
              <RotateCcw size={20} className="icon-red" />
              <span className="setting-name text-emergency">Đặt lại dữ liệu Demo mặc định</span>
            </div>
            <ChevronRight size={18} className="arrow-muted" />
          </div>
        </div>
      </div>

      {/* App Version Info */}
      <div className="app-info-footer">
        <img src="/logo.png" alt="PetCare" className="footer-logo" />
        <h4>PetCare Progressive Web App</h4>
        <p>Phiên bản 1.0.0 • Mobile-First PWA</p>
        <span className="slogan-txt">"Healthy Pets • Happy Lives"</span>
      </div>

      {/* Privacy Policy Modal */}
      {showPrivacy && (
        <div className="modal-backdrop" onClick={() => setShowPrivacy(false)}>
          <div className="modal-sheet animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Chính Sách Quyền Riêng Tư</h3>
              <button className="modal-close-btn" onClick={() => setShowPrivacy(false)}>✕</button>
            </div>
            <div className="modal-body legal-body">
              <p><strong>1. Thu thập dữ liệu cục bộ:</strong> PetCare lưu trữ hồ sơ y tế, ảnh cân nặng và lịch tiêm chủng trực tiếp trên thiết bị của bạn thông qua LocalStorage an toàn.</p>
              <p><strong>2. Vị trí GPS:</strong> Chúng tôi chỉ sử dụng Geolocation API khi bạn chủ động ấn "Gần tôi nhất" để tính khoảng cách tới bệnh viện thú y gần nhất. Chúng tôi không theo dõi vị trí nền liên tục.</p>
              <p><strong>3. Bảo mật hình ảnh:</strong> Ảnh chụp thú cưng không bị công khai trên mạng trừ khi bạn chủ động đăng bài trong mục Cộng đồng hoặc Báo tìm thú cưng thất lạc.</p>
            </div>
            <div className="modal-footer">
              <button className="btn-primary" onClick={() => setShowPrivacy(false)}>Đã hiểu</button>
            </div>
          </div>
        </div>
      )}

      {/* Terms Modal */}
      {showTerms && (
        <div className="modal-backdrop" onClick={() => setShowTerms(false)}>
          <div className="modal-sheet animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Điều Khoản Dịch Vụ & An Toàn Y Tế</h3>
              <button className="modal-close-btn" onClick={() => setShowTerms(false)}>✕</button>
            </div>
            <div className="modal-body legal-body">
              <p><strong>CẢNH BÁO QUAN TRỌNG:</strong> Ứng dụng PetCare và Trợ lý AI cung cấp thông tin sơ cứu và kiến thức chăm sóc thú cưng mang tính tham khảo ban đầu.</p>
              <p>Ứng dụng KHÔNG thay thế việc thăm khám, xét nghiệm và chẩn đoán lâm sàng của bác sĩ thú y có chứng chỉ hành nghề. Trong mọi tình huống nguy kịch, chủ nuôi cần đưa thú cưng tới cơ sở y tế gần nhất càng sớm càng tốt.</p>
            </div>
            <div className="modal-footer">
              <button className="btn-primary" onClick={() => setShowTerms(false)}>Đồng ý</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .settings-container {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .user-profile-card {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px;
        }

        .user-avatar {
          width: 56px;
          height: 56px;
          border-radius: var(--radius-full);
          object-fit: cover;
          box-shadow: var(--shadow-sm);
        }

        .user-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex: 1;
        }

        .user-name-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .user-name {
          font-size: 1.05rem;
          margin: 0;
        }

        .auth-badge {
          font-size: 0.65rem;
          font-weight: 700;
          padding: 2px 7px;
          border-radius: 9999px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .auth-badge.verified {
          background: rgba(16, 185, 129, 0.15);
          color: #10b981;
        }

        .auth-badge.guest {
          background: rgba(245, 158, 11, 0.15);
          color: #f59e0b;
        }

        .user-auth-action {
          flex-shrink: 0;
        }

        .btn-auth-logout {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 6px 12px;
          border-radius: 8px;
          border: 1px solid var(--border-color);
          background: transparent;
          color: var(--text-muted);
          font-size: 0.76rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-auth-logout:hover {
          border-color: #ef4444;
          color: #ef4444;
          background: rgba(239, 68, 68, 0.08);
        }

        .btn-auth-login {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          border-radius: 10px;
          border: none;
          background: linear-gradient(135deg, #149a8c, #0e7490);
          color: #ffffff;
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(20, 154, 140, 0.3);
          transition: transform 0.15s ease;
        }

        .btn-auth-login:active {
          transform: scale(0.96);
        }

        .user-email {
          font-size: 0.78rem;
          color: var(--text-muted);
        }

        .user-phone {
          font-size: 0.74rem;
          color: var(--primary);
          font-weight: 600;
        }

        .settings-block {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .block-head-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .block-title {
          font-size: 0.95rem;
          color: var(--text-main);
        }

        .pets-mini-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 12px;
        }

        .pet-mini-item {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .p-avatar {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-md);
          object-fit: cover;
        }

        .p-text {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .p-name {
          font-size: 0.9rem;
          font-weight: 700;
        }

        .p-sub {
          font-size: 0.74rem;
          color: var(--text-muted);
        }

        .settings-list-card {
          display: flex;
          flex-direction: column;
          padding: 4px 14px;
        }

        .setting-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid var(--border-color);
        }

        .setting-row:last-child {
          border-bottom: none;
        }

        .setting-row.clickable {
          cursor: pointer;
        }

        .setting-row-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .setting-name {
          font-size: 0.88rem;
          font-weight: 600;
          display: block;
        }

        .setting-sub {
          font-size: 0.74rem;
          color: var(--text-muted);
        }

        .icon-blue { color: #2563eb; }
        .icon-orange { color: #f59e0b; }
        .icon-purple { color: #9333ea; }
        .icon-green { color: #10b981; }
        .icon-teal { color: #149a8c; }
        .icon-red { color: var(--emergency); }

        .text-emergency {
          color: var(--emergency);
        }

        .arrow-muted {
          color: var(--text-muted);
        }

        .app-info-footer {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 20px;
          gap: 6px;
        }

        .footer-logo {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          margin-bottom: 4px;
        }

        .app-info-footer h4 {
          font-size: 0.95rem;
        }

        .app-info-footer p {
          font-size: 0.76rem;
          color: var(--text-muted);
        }

        .slogan-txt {
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--primary);
        }

        .legal-body {
          display: flex;
          flex-direction: column;
          gap: 12px;
          font-size: 0.85rem;
          line-height: 1.5;
        }

        .emergency-setting-box {
          padding: 16px;
          background: #fef2f2;
          border: 1.5px solid #fecaca;
          border-radius: 16px;
        }

        [data-theme="dark"] .emergency-setting-box {
          background: rgba(239, 68, 68, 0.1);
          border-color: rgba(239, 68, 68, 0.3);
        }

        .emergency-preview-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .emergency-preview-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .vet-badge-icon {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background: rgba(220, 38, 38, 0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #dc2626;
          flex-shrink: 0;
        }

        .vet-preview-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .preview-title {
          font-size: 0.92rem;
          font-weight: 700;
          color: var(--text-main);
        }

        .preview-phone {
          font-size: 1.05rem;
          font-weight: 800;
          color: #dc2626;
          letter-spacing: 0.02em;
        }

        .preview-hint {
          font-size: 0.72rem;
          color: var(--text-muted);
        }

        .btn-call-test {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          background: #10b981;
          color: #ffffff !important;
          border-radius: 10px;
          font-size: 0.82rem;
          font-weight: 700;
          text-decoration: none;
          box-shadow: 0 2px 8px rgba(16, 185, 129, 0.25);
          flex-shrink: 0;
        }
      `}</style>
    </div>
  );
};
