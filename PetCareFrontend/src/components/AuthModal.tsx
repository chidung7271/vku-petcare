import React, { useState } from 'react';
import { UserProfile } from '../types';
import { apiClient } from '../services/apiClient';
import { 
  X, 
  LogIn, 
  UserPlus, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  Eye, 
  EyeOff, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  HeartHandshake
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserProfile) => void;
  onShowToast: (text: string, type: 'success' | 'warning' | 'info' | 'error') => void;
  initialMode?: 'login' | 'register';
  messageHint?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onShowToast,
  initialMode = 'login',
  messageHint
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  if (!isOpen) return null;

  const resetForm = () => {
    setErrorMsg(null);
    setEmail('');
    setPassword('');
    setName('');
    setPhone('');
    setConfirmPassword('');
  };

  const handleSwitchMode = (newMode: 'login' | 'register') => {
    setMode(newMode);
    setErrorMsg(null);
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        if (!email.trim() || !password.trim()) {
          setErrorMsg('Vui lòng điền đầy đủ email và mật khẩu');
          setLoading(false);
          return;
        }

        try {
          // Attempt real backend login
          const data = await apiClient.login(email.trim().toLowerCase(), password);
          const loggedInUser: UserProfile = {
            id: data.user?.id || data.user?._id || 'user_' + Date.now(),
            name: data.user?.name || email.split('@')[0],
            email: data.user?.email || email.trim(),
            phone: data.user?.phone || phone || '',
            avatar: data.user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
            emergencyContact: data.user?.emergencyContact || '0988 765 432',
            emergencyContactName: 'BS. Nam (Bệnh Viện Thú Y PetHealth)',
            isLoggedIn: true
          };
          onSuccess(loggedInUser);
          onShowToast(`Chào mừng ${loggedInUser.name} quay trở lại! 🐾`, 'success');
          onClose();
        } catch (apiErr: any) {
          console.warn('Backend login error:', apiErr.message);
          if (apiErr.message?.includes('401') || apiErr.message?.includes('sai') || apiErr.message?.includes('Unauthorized')) {
            setErrorMsg('Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại!');
          } else {
            setErrorMsg(apiErr.message || 'Không thể kết nối đến máy chủ Backend. Vui lòng thử lại!');
          }
        }
      } else {
        // Register Mode
        if (!name.trim()) {
          setErrorMsg('Vui lòng nhập họ và tên của bạn');
          setLoading(false);
          return;
        }
        if (!email.trim() || !email.includes('@')) {
          setErrorMsg('Địa chỉ email không hợp lệ');
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setErrorMsg('Mật khẩu phải có ít nhất 6 ký tự');
          setLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          setErrorMsg('Mật khẩu xác nhận không khớp');
          setLoading(false);
          return;
        }

        try {
          // Attempt real backend registration
          const data = await apiClient.register(
            name.trim(),
            email.trim().toLowerCase(),
            password,
            phone.trim() || undefined
          );
          const newUser: UserProfile = {
            id: data.user?.id || data.user?._id || 'user_' + Date.now(),
            name: data.user?.name || name.trim(),
            email: data.user?.email || email.trim(),
            phone: data.user?.phone || phone.trim() || '',
            avatar: data.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
            emergencyContact: phone.trim() || '0988 765 432',
            emergencyContactName: 'Bác sĩ thú y riêng',
            isLoggedIn: true
          };
          onSuccess(newUser);
          onShowToast(`Đăng ký tài khoản thành công! Chào mừng ${newUser.name} gia nhập PetCare! 🎉`, 'success');
          onClose();
        } catch (apiErr: any) {
          console.warn('Backend register error:', apiErr.message);
          if (apiErr.message?.includes('đã tồn tại') || apiErr.message?.includes('already exists') || apiErr.message?.includes('409')) {
            setErrorMsg('Email này đã được đăng ký. Vui lòng chuyển sang Đăng nhập!');
          } else {
            setErrorMsg(apiErr.message || 'Đăng ký thất bại. Vui lòng kiểm tra lại thông tin!');
          }
        }
      }
    } finally {
      setLoading(false);
    }
  };

  // Quick Demo Login helper
  const handleQuickDemo = () => {
    setEmail('thanhtung.petcare@gmail.com');
    setPassword('123456');
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 1100 }}>
      <div 
        className="modal-sheet animate-fade-in auth-modal-sheet" 
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '440px', width: '100%', borderRadius: '24px', overflow: 'hidden' }}
      >
        {/* Header Hero */}
        <div className="auth-header-hero">
          <div className="auth-brand-badge">
            <img src="/logo.png" alt="PetCare" className="auth-logo-img" />
            <div>
              <h3 className="auth-app-title">PetCare Account</h3>
              <p className="auth-app-slogan">Trợ lý y tế & cộng đồng thú cưng</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Đóng">
            <X size={20} />
          </button>
        </div>

        {/* Action Tabs: Login vs Register */}
        <div className="auth-tabs-row">
          <button 
            type="button"
            className={`auth-tab-btn ${mode === 'login' ? 'active' : ''}`}
            onClick={() => handleSwitchMode('login')}
          >
            <LogIn size={16} />
            <span>Đăng Nhập</span>
          </button>
          <button 
            type="button"
            className={`auth-tab-btn ${mode === 'register' ? 'active' : ''}`}
            onClick={() => handleSwitchMode('register')}
          >
            <UserPlus size={16} />
            <span>Đăng Ký Mới</span>
          </button>
        </div>

        {/* Message Hint if opened by Auth Guard */}
        {messageHint && (
          <div className="auth-hint-banner">
            <HeartHandshake size={18} className="hint-icon" />
            <span>{messageHint}</span>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="auth-error-alert animate-fade-in">
            <AlertCircle size={18} className="error-icon" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="auth-form-body">
          {mode === 'register' && (
            <>
              <div className="form-group">
                <label className="auth-label">Họ và tên chủ nuôi *</label>
                <div className="auth-input-wrap">
                  <User size={18} className="input-icon" />
                  <input 
                    type="text" 
                    className="auth-input" 
                    placeholder="VD: Nguyễn Thanh Tùng"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="auth-label">Số điện thoại liên hệ</label>
                <div className="auth-input-wrap">
                  <Phone size={18} className="input-icon" />
                  <input 
                    type="tel" 
                    className="auth-input" 
                    placeholder="VD: 0901 234 567"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                  />
                </div>
              </div>
            </>
          )}

          <div className="form-group">
            <label className="auth-label">Email tài khoản *</label>
            <div className="auth-input-wrap">
              <Mail size={18} className="input-icon" />
              <input 
                type="email" 
                className="auth-input" 
                placeholder="VD: user@petcare.vn"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>
          </div>

          <div className="form-group">
            <label className="auth-label">
              Mật khẩu * {mode === 'register' && <span className="label-hint">(Ít nhất 6 ký tự)</span>}
            </label>
            <div className="auth-input-wrap">
              <Lock size={18} className="input-icon" />
              <input 
                type={showPassword ? 'text' : 'password'} 
                className="auth-input" 
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button 
                type="button" 
                className="btn-toggle-eye"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {mode === 'register' && (
            <div className="form-group">
              <label className="auth-label">Xác nhận lại mật khẩu *</label>
              <div className="auth-input-wrap">
                <Lock size={18} className="input-icon" />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  className="auth-input" 
                  placeholder="Nhập lại mật khẩu"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button 
            type="submit" 
            className="btn-auth-submit"
            disabled={loading}
          >
            {loading ? (
              <span className="spinner-loading">Đang kết nối...</span>
            ) : mode === 'login' ? (
              <>
                <LogIn size={18} />
                <span>Đăng Nhập Ngay</span>
              </>
            ) : (
              <>
                <Sparkles size={18} />
                <span>Hoàn Tất Đăng Ký</span>
              </>
            )}
          </button>

          {/* Quick Demo Helper (Only in Login mode) */}
          {mode === 'login' && (
            <div className="quick-demo-box">
              <span>Thử nhanh tài khoản mẫu: </span>
              <button 
                type="button" 
                className="btn-quick-fill"
                onClick={handleQuickDemo}
              >
                Điền mẫu tự động
              </button>
            </div>
          )}

          {/* Guest Mode Dismiss */}
          <div className="guest-mode-row">
            <button 
              type="button" 
              className="btn-guest-dismiss"
              onClick={onClose}
            >
              Tiếp tục với tư cách Khách vãng lai
            </button>
          </div>
        </form>

        {/* Footer Security Badge */}
        <div className="auth-footer-badge">
          <ShieldCheck size={14} className="shield-icon" />
          <span>Bảo mật JWT 256-bit • Mã hóa mật khẩu an toàn</span>
        </div>
      </div>

      <style>{`
        .auth-modal-sheet {
          background: #ffffff !important;
          color: #1e293b !important;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
        }

        [data-theme="dark"] .auth-modal-sheet {
          background: #1e293b !important;
          color: #f8fafc !important;
        }

        .auth-header-hero {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          background: linear-gradient(135deg, #149a8c, #0e7490);
          color: #ffffff;
        }

        .auth-brand-badge {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .auth-logo-img {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          object-fit: cover;
          box-shadow: 0 4px 10px rgba(0,0,0,0.2);
          background: #ffffff;
        }

        .auth-app-title {
          font-size: 1.15rem;
          font-weight: 800;
          color: #ffffff;
          margin: 0;
          letter-spacing: -0.01em;
        }

        .auth-app-slogan {
          font-size: 0.72rem;
          color: rgba(255, 255, 255, 0.9);
          margin: 2px 0 0 0;
        }

        .auth-tabs-row {
          display: flex;
          background: var(--bg-main);
          padding: 6px 12px;
          gap: 8px;
          border-bottom: 1px solid var(--border-color);
        }

        .auth-tab-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px 14px;
          border-radius: 12px;
          border: none;
          background: transparent;
          color: var(--text-muted);
          font-size: 0.88rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .auth-tab-btn.active {
          background: var(--bg-card);
          color: var(--primary);
          box-shadow: var(--shadow-sm);
        }

        .auth-hint-banner {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 12px 20px 0;
          padding: 10px 14px;
          background: #ecfdf5;
          border: 1px solid #a7f3d0;
          border-radius: 12px;
          font-size: 0.8rem;
          color: #065f46;
          font-weight: 600;
        }

        [data-theme="dark"] .auth-hint-banner {
          background: rgba(16, 185, 129, 0.12);
          border-color: rgba(16, 185, 129, 0.3);
          color: #6ee7b7;
        }

        .hint-icon {
          color: #10b981;
          flex-shrink: 0;
        }

        .auth-error-alert {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 12px 20px 0;
          padding: 10px 14px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 12px;
          font-size: 0.8rem;
          color: #dc2626;
          font-weight: 600;
        }

        [data-theme="dark"] .auth-error-alert {
          background: rgba(239, 68, 68, 0.12);
          border-color: rgba(239, 68, 68, 0.3);
          color: #fca5a5;
        }

        .error-icon {
          color: #dc2626;
          flex-shrink: 0;
        }

        .auth-form-body {
          padding: 16px 20px 12px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          max-height: 65vh;
          overflow-y: auto;
        }

        .auth-label {
          display: block;
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 6px;
        }

        .label-hint {
          font-weight: normal;
          color: var(--text-muted);
          font-size: 0.7rem;
        }

        .auth-input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 12px;
          color: var(--text-muted);
          pointer-events: none;
        }

        .auth-input {
          width: 100%;
          min-height: 44px;
          padding: 8px 40px 8px 38px;
          border-radius: 12px;
          border: 1.5px solid var(--border-color);
          background: var(--bg-card);
          color: var(--text-main);
          font-size: 0.9rem;
          font-family: inherit;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .auth-input:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(20, 154, 140, 0.15);
        }

        .btn-toggle-eye {
          position: absolute;
          right: 12px;
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .btn-auth-submit {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          min-height: 48px;
          background: linear-gradient(135deg, #149a8c, #0e7490);
          color: #ffffff !important;
          border: none;
          border-radius: 14px;
          font-size: 0.95rem;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(20, 154, 140, 0.35);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
          margin-top: 4px;
        }

        .btn-auth-submit:active {
          transform: scale(0.98);
        }

        .btn-auth-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .quick-demo-box {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 0.76rem;
          color: var(--text-muted);
          margin-top: 2px;
        }

        .btn-quick-fill {
          background: var(--primary-soft);
          color: var(--primary);
          border: 1px dashed var(--primary);
          border-radius: 6px;
          padding: 2px 8px;
          font-size: 0.74rem;
          font-weight: 700;
          cursor: pointer;
        }

        .guest-mode-row {
          display: flex;
          justify-content: center;
          margin-top: 4px;
        }

        .btn-guest-dismiss {
          background: transparent;
          border: none;
          color: var(--text-muted);
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          text-decoration: underline;
          padding: 4px 8px;
        }

        .btn-guest-dismiss:hover {
          color: var(--primary);
        }

        .auth-footer-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 10px 16px;
          background: var(--bg-main);
          font-size: 0.68rem;
          color: var(--text-muted);
          border-top: 1px solid var(--border-color);
        }

        .shield-icon {
          color: var(--primary);
        }
      `}</style>
    </div>
  );
};
