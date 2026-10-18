import React, { useState } from 'react';
import { Pet, PetSpecies, PetGender } from '../types';
import { 
  Sparkles, 
  Heart, 
  ShieldCheck, 
  Bell, 
  MapPin, 
  Camera, 
  ArrowRight, 
  Check, 
  PlusCircle 
} from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (newPet?: Pet) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onComplete
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State for New Pet
  const [name, setName] = useState('');
  const [species, setSpecies] = useState<PetSpecies>('dog');
  const [breed, setBreed] = useState('');
  const [gender, setGender] = useState<PetGender>('male');
  const [birthDate, setBirthDate] = useState('');
  const [estimatedAge, setEstimatedAge] = useState('');
  const [weight, setWeight] = useState<number>(5.0);
  const [coatColor, setCoatColor] = useState('');
  const [avatar, setAvatar] = useState(
    'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80'
  );
  const [microchip, setMicrochip] = useState('');
  const [isNeutered, setIsNeutered] = useState(false);
  const [allergiesText, setAllergiesText] = useState('');
  const [chronicText, setChronicText] = useState('');
  const [medsText, setMedsText] = useState('');
  const [preferredVet, setPreferredVet] = useState('');

  // Permission toggles
  const [notifGranted, setNotifGranted] = useState(false);
  const [locGranted, setLocGranted] = useState(false);

  if (!isOpen) return null;

  const handleRequestNotif = async () => {
    if ('Notification' in window) {
      try {
        const res = await Notification.requestPermission();
        if (res === 'granted') setNotifGranted(true);
      } catch {
        // fallback
      }
    }
  };

  const handleRequestLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => setLocGranted(true),
        () => setLocGranted(false)
      );
    }
  };

  const handleFinish = () => {
    let createdPet: Pet | undefined;
    if (name.trim()) {
      createdPet = {
        id: 'pet_' + Date.now(),
        name: name.trim(),
        species,
        breed: breed.trim() || (species === 'dog' ? 'Chó Cảnh' : species === 'cat' ? 'Mèo Nhà' : 'Thú cưng'),
        gender,
        birthDate: birthDate || undefined,
        estimatedAge: estimatedAge.trim() || '1 tuổi',
        weight: Number(weight) || 4.5,
        coatColor: coatColor.trim() || 'Đa sắc',
        avatar,
        microchip: microchip.trim() || undefined,
        isNeutered,
        allergies: allergiesText ? allergiesText.split(',').map(s => s.trim()) : [],
        chronicConditions: chronicText ? chronicText.split(',').map(s => s.trim()) : [],
        currentMedications: medsText ? medsText.split(',').map(s => s.trim()) : [],
        preferredVet: preferredVet.trim() || undefined,
        createdAt: new Date().toISOString()
      };
    }
    onComplete(createdPet);
  };

  return (
    <div className="onboarding-overlay">
      <div className="onboarding-card animate-fade-in">
        {/* Step Indicator */}
        <div className="step-indicator-bar">
          <div className={`step-dot ${step >= 1 ? 'active' : ''}`}>1</div>
          <div className={`step-line ${step >= 2 ? 'active' : ''}`} />
          <div className={`step-dot ${step >= 2 ? 'active' : ''}`}>2</div>
          <div className={`step-line ${step >= 3 ? 'active' : ''}`} />
          <div className={`step-dot ${step >= 3 ? 'active' : ''}`}>3</div>
        </div>

        {/* STEP 1: WELCOME */}
        {step === 1 && (
          <div className="step-view">
            <div className="logo-center">
              <img src="/logo.png" alt="PetCare" className="welcome-logo" />
              <h2 className="welcome-title">Chào mừng đến với PetCare</h2>
              <p className="welcome-desc">
                Trợ lý sức khỏe số đồng hành toàn diện cùng thú cưng của bạn. Luôn sẵn sàng mọi lúc, mọi nơi kể cả khi khẩn cấp.
              </p>
            </div>

            <div className="feature-highlights">
              <div className="highlight-item">
                <div className="h-icon"><ShieldCheck size={20} /></div>
                <div>
                  <h4>Sổ Sức Khỏe & Tiêm Phòng</h4>
                  <p>Lưu trữ mũi vaccine, lịch tẩy giun và lịch sử khám bệnh trọn đời.</p>
                </div>
              </div>

              <div className="highlight-item">
                <div className="h-icon alert"><Heart size={20} /></div>
                <div>
                  <h4>Trợ Lý Cấp Cứu Thú Y 24/7</h4>
                  <p>Phản xạ tức thì khi thú cưng nuốt dị vật, ăn chất độc hoặc tai nạn.</p>
                </div>
              </div>

              <div className="highlight-item">
                <div className="h-icon purple"><Sparkles size={20} /></div>
                <div>
                  <h4>AI Bác Sĩ & Tìm Cơ Sở Gần Nhất</h4>
                  <p>Hỏi đáp triệu chứng chuẩn y khoa và chỉ đường phòng khám gần bạn.</p>
                </div>
              </div>
            </div>

            <button className="btn-primary w-full" onClick={() => setStep(2)}>
              <span>Bắt đầu thêm thú cưng</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}

        {/* STEP 2: ADD PET */}
        {step === 2 && (
          <div className="step-view">
            <div className="form-header">
              <h3>Hồ sơ thú cưng đầu tiên</h3>
              <p>Điền thông tin để PetCare cá nhân hóa lộ trình chăm sóc.</p>
            </div>

            <div className="scrollable-form">
              {/* Species picker */}
              <div className="species-row">
                <button
                  type="button"
                  className={`species-btn ${species === 'dog' ? 'active' : ''}`}
                  onClick={() => setSpecies('dog')}
                >
                  🐶 Chó
                </button>
                <button
                  type="button"
                  className={`species-btn ${species === 'cat' ? 'active' : ''}`}
                  onClick={() => setSpecies('cat')}
                >
                  🐱 Mèo
                </button>
                <button
                  type="button"
                  className={`species-btn ${species === 'other' ? 'active' : ''}`}
                  onClick={() => setSpecies('other')}
                >
                  🐰 Khác
                </button>
              </div>

              <div className="input-group">
                <label className="input-label">Tên thú cưng *</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="Ví dụ: Milo, Bơ, Cỏ..." 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                />
              </div>

              <div className="grid-2">
                <div className="input-group">
                  <label className="input-label">Giống loài</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="VD: Golden, Poodle..." 
                    value={breed} 
                    onChange={e => setBreed(e.target.value)} 
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Giới tính</label>
                  <select 
                    className="select-field"
                    value={gender}
                    onChange={e => setGender(e.target.value as PetGender)}
                  >
                    <option value="male">Đực</option>
                    <option value="female">Cái</option>
                  </select>
                </div>
              </div>

              <div className="grid-2">
                <div className="input-group">
                  <label className="input-label">Cân nặng (kg)</label>
                  <input 
                    type="number" 
                    step="0.1" 
                    className="input-field" 
                    value={weight} 
                    onChange={e => setWeight(parseFloat(e.target.value) || 0)} 
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Màu lông</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="VD: Trắng xám, Vàng..." 
                    value={coatColor} 
                    onChange={e => setCoatColor(e.target.value)} 
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Ngày sinh hoặc Tuổi ước tính</label>
                <input 
                  type="date" 
                  className="input-field" 
                  value={birthDate} 
                  onChange={e => setBirthDate(e.target.value)} 
                />
              </div>

              <div className="input-group">
                <label className="input-label">Mã Microchip (nếu có)</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="VD: VN-982000..." 
                  value={microchip} 
                  onChange={e => setMicrochip(e.target.value)} 
                />
              </div>

              <div className="checkbox-row">
                <input 
                  type="checkbox" 
                  id="neutered_check" 
                  checked={isNeutered} 
                  onChange={e => setIsNeutered(e.target.checked)} 
                />
                <label htmlFor="neutered_check">Đã phẫu thuật triệt sản</label>
              </div>

              <div className="input-group">
                <label className="input-label">Dị ứng đã biết (nếu có)</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="VD: Dị ứng thịt bò, phấn hoa..." 
                  value={allergiesText} 
                  onChange={e => setAllergiesText(e.target.value)} 
                />
              </div>

              <div className="input-group">
                <label className="input-label">Bác sĩ / Phòng khám quen thuộc</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="VD: BS. Đức - BV PetHealth..." 
                  value={preferredVet} 
                  onChange={e => setPreferredVet(e.target.value)} 
                />
              </div>
            </div>

            <div className="action-row">
              <button className="btn-outline" onClick={() => setStep(1)}>Quay lại</button>
              <button className="btn-primary" onClick={() => setStep(3)}>
                <span>Tiếp tục</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: PERMISSIONS EXPLAINER */}
        {step === 3 && (
          <div className="step-view">
            <div className="form-header">
              <h3>Quyền truy cập & Hoàn tất</h3>
              <p>PetCare chỉ yêu cầu các quyền thực sự cần thiết để bảo vệ thú cưng tốt nhất.</p>
            </div>

            <div className="permission-list">
              <div className="perm-card">
                <div className="perm-left">
                  <div className="perm-icon purple"><Bell size={20} /></div>
                  <div className="perm-info">
                    <h5>Nhắc lịch thông minh</h5>
                    <p>Báo chuông nhắc lịch tiêm vaccine, tẩy giun và uống thuốc đúng hẹn.</p>
                  </div>
                </div>
                <button 
                  className={`perm-btn ${notifGranted ? 'granted' : ''}`}
                  onClick={handleRequestNotif}
                >
                  {notifGranted ? <Check size={16} /> : 'Bật'}
                </button>
              </div>

              <div className="perm-card">
                <div className="perm-left">
                  <div className="perm-icon teal"><MapPin size={20} /></div>
                  <div className="perm-info">
                    <h5>Vị trí bệnh viện thú y</h5>
                    <p>Tự động tìm bệnh viện 24/7 và cơ sở cấp cứu gần bạn nhất khi khẩn cấp.</p>
                  </div>
                </div>
                <button 
                  className={`perm-btn ${locGranted ? 'granted' : ''}`}
                  onClick={handleRequestLocation}
                >
                  {locGranted ? <Check size={16} /> : 'Bật'}
                </button>
              </div>

              <div className="perm-card">
                <div className="perm-left">
                  <div className="perm-icon blue"><Camera size={20} /></div>
                  <div className="perm-info">
                    <h5>Camera & Thư viện ảnh</h5>
                    <p>Lưu nhật ký phát triển Before/After và tạo áp phích tìm thú cưng lạc.</p>
                  </div>
                </div>
                <span className="perm-badge">Hỏi khi dùng</span>
              </div>
            </div>

            <div className="action-row" style={{ marginTop: '24px' }}>
              <button className="btn-outline" onClick={() => setStep(2)}>Quay lại</button>
              <button className="btn-primary" onClick={handleFinish}>
                <Check size={18} />
                <span>Hoàn tất & Trải nghiệm</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .onboarding-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(11, 17, 32, 0.8);
          backdrop-filter: blur(8px);
          z-index: 150;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
        }

        .onboarding-card {
          width: 100%;
          max-width: 440px;
          background: var(--bg-card);
          border-radius: var(--radius-xl);
          padding: 24px 20px;
          box-shadow: var(--shadow-xl);
          border: 1px solid var(--border-color);
          max-height: 92vh;
          display: flex;
          flex-direction: column;
        }

        .step-indicator-bar {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          gap: 6px;
        }

        .step-dot {
          width: 26px;
          height: 26px;
          border-radius: var(--radius-full);
          background: var(--secondary-soft);
          color: var(--text-muted);
          font-size: 0.75rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .step-dot.active {
          background: var(--primary);
          color: #ffffff;
        }

        .step-line {
          width: 32px;
          height: 3px;
          background: var(--secondary-soft);
          border-radius: 2px;
        }

        .step-line.active {
          background: var(--primary);
        }

        .step-view {
          display: flex;
          flex-direction: column;
          flex: 1;
          overflow: hidden;
        }

        .logo-center {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          margin-bottom: 20px;
        }

        .welcome-logo {
          width: 72px;
          height: 72px;
          border-radius: 18px;
          margin-bottom: 12px;
          box-shadow: 0 4px 14px rgba(20, 154, 140, 0.3);
        }

        .welcome-title {
          font-size: 1.3rem;
          margin-bottom: 6px;
        }

        .welcome-desc {
          font-size: 0.85rem;
          color: var(--text-muted);
          line-height: 1.45;
        }

        .feature-highlights {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 24px;
        }

        .highlight-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 10px;
          border-radius: var(--radius-md);
          background: var(--bg-main);
        }

        .highlight-item h4 {
          font-size: 0.9rem;
          margin-bottom: 2px;
        }

        .highlight-item p {
          font-size: 0.76rem;
          color: var(--text-muted);
        }

        .h-icon {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-sm);
          background: var(--primary-soft);
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .h-icon.alert {
          background: var(--emergency-soft);
          color: var(--emergency);
        }

        .h-icon.purple {
          background: #faf5ff;
          color: #9333ea;
        }

        .form-header {
          margin-bottom: 16px;
        }

        .form-header h3 {
          font-size: 1.15rem;
          margin-bottom: 4px;
        }

        .form-header p {
          font-size: 0.82rem;
          color: var(--text-muted);
        }

        .scrollable-form {
          flex: 1;
          overflow-y: auto;
          padding-right: 4px;
          margin-bottom: 16px;
        }

        .species-row {
          display: flex;
          gap: 8px;
          margin-bottom: 14px;
        }

        .species-btn {
          flex: 1;
          min-height: 42px;
          border: 1.5px solid var(--border-color);
          background: var(--bg-main);
          border-radius: var(--radius-md);
          font-size: 0.9rem;
          color: var(--text-main);
        }

        .species-btn.active {
          border-color: var(--primary);
          background: var(--primary-soft);
          color: var(--primary);
          font-weight: 700;
        }

        .grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .checkbox-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 14px;
          font-size: 0.88rem;
          color: var(--text-main);
          cursor: pointer;
        }

        .permission-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .perm-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px;
          border-radius: var(--radius-md);
          background: var(--bg-main);
          border: 1px solid var(--border-color);
        }

        .perm-left {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
        }

        .perm-icon {
          width: 38px;
          height: 38px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .perm-icon.purple { background: #faf5ff; color: #9333ea; }
        .perm-icon.teal { background: #e6f7f5; color: #149a8c; }
        .perm-icon.blue { background: #eff6ff; color: #2563eb; }

        .perm-info h5 {
          font-size: 0.88rem;
          margin-bottom: 2px;
        }

        .perm-info p {
          font-size: 0.74rem;
          color: var(--text-muted);
        }

        .perm-btn {
          min-height: 32px;
          padding: 0 14px;
          border-radius: var(--radius-full);
          background: var(--primary);
          color: #ffffff;
          font-size: 0.8rem;
          font-weight: 700;
        }

        .perm-btn.granted {
          background: var(--success);
        }

        .perm-badge {
          font-size: 0.72rem;
          color: var(--text-muted);
          background: var(--secondary-soft);
          padding: 4px 8px;
          border-radius: var(--radius-full);
        }

        .action-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .action-row button {
          flex: 1;
        }

        .w-full {
          width: 100%;
        }
      `}</style>
    </div>
  );
};
