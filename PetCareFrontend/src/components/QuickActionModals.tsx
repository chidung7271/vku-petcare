import React, { useState } from 'react';
import { Pet, PetSpecies, PetGender, WeightRecord, PetPhoto, Reminder, ReminderType, ReminderPriority, RepeatFrequency } from '../types';

interface AddPetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (pet: Pet) => void;
  initialPet?: Pet | null;
  onUpdate?: (pet: Pet) => void;
}

export const AddPetModal: React.FC<AddPetModalProps> = ({ 
  isOpen, 
  onClose, 
  onAdd, 
  initialPet,
  onUpdate 
}) => {
  const isEditing = Boolean(initialPet);
  const [name, setName] = useState(initialPet?.name || '');
  const [species, setSpecies] = useState<PetSpecies>(initialPet?.species || 'dog');
  const [breed, setBreed] = useState(initialPet?.breed || '');
  const [gender, setGender] = useState<PetGender>(initialPet?.gender || 'male');
  const [birthDate, setBirthDate] = useState(initialPet?.birthDate || '');
  const [estimatedAge, setEstimatedAge] = useState(initialPet?.estimatedAge || '');
  const [weight, setWeight] = useState<number>(initialPet?.weight || 4.5);
  const [coatColor, setCoatColor] = useState(initialPet?.coatColor || '');
  const [avatar, setAvatar] = useState(initialPet?.avatar || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80');
  const [microchip, setMicrochip] = useState(initialPet?.microchip || '');
  const [isNeutered, setIsNeutered] = useState(initialPet?.isNeutered || false);
  const [allergies, setAllergies] = useState(initialPet?.allergies?.join(', ') || '');
  const [preferredVet, setPreferredVet] = useState(initialPet?.preferredVet || '');

  // Reset form when initialPet changes
  React.useEffect(() => {
    if (initialPet) {
      setName(initialPet.name || '');
      setSpecies(initialPet.species || 'dog');
      setBreed(initialPet.breed || '');
      setGender(initialPet.gender || 'male');
      setBirthDate(initialPet.birthDate || '');
      setEstimatedAge(initialPet.estimatedAge || '');
      setWeight(initialPet.weight || 4.5);
      setCoatColor(initialPet.coatColor || '');
      setAvatar(initialPet.avatar || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80');
      setMicrochip(initialPet.microchip || '');
      setIsNeutered(initialPet.isNeutered || false);
      setAllergies(initialPet.allergies?.join(', ') || '');
      setPreferredVet(initialPet.preferredVet || '');
    } else {
      setName('');
      setSpecies('dog');
      setBreed('');
      setGender('male');
      setBirthDate('');
      setEstimatedAge('');
      setWeight(4.5);
      setCoatColor('');
      setAvatar('https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80');
      setMicrochip('');
      setIsNeutered(false);
      setAllergies('');
      setPreferredVet('');
    }
  }, [initialPet, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (isEditing && initialPet && onUpdate) {
      const updatedPet: Pet = {
        ...initialPet,
        name: name.trim(),
        species,
        breed: breed.trim() || (species === 'dog' ? 'Chó Cảnh' : species === 'cat' ? 'Mèo Nhà' : 'Thú cưng'),
        gender,
        birthDate: birthDate || undefined,
        estimatedAge: estimatedAge.trim() || '1 tuổi',
        weight: Number(weight) || 4.5,
        coatColor: coatColor.trim() || 'Đa sắc',
        avatar: avatar.trim() || initialPet.avatar,
        microchip: microchip.trim() || undefined,
        isNeutered,
        allergies: allergies ? allergies.split(',').map(s => s.trim()).filter(Boolean) : [],
        preferredVet: preferredVet.trim() || undefined,
      };
      onUpdate(updatedPet);
      onClose();
      return;
    }

    const newPet: Pet = {
      id: 'pet_' + Date.now(),
      name: name.trim(),
      species,
      breed: breed.trim() || (species === 'dog' ? 'Chó Cảnh' : species === 'cat' ? 'Mèo Nhà' : 'Thú cưng'),
      gender,
      birthDate: birthDate || undefined,
      estimatedAge: estimatedAge.trim() || '1 tuổi',
      weight: Number(weight) || 4.5,
      coatColor: coatColor.trim() || 'Đa sắc',
      avatar: avatar.trim() || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80',
      microchip: microchip.trim() || undefined,
      isNeutered,
      allergies: allergies ? allergies.split(',').map(s => s.trim()).filter(Boolean) : [],
      chronicConditions: [],
      currentMedications: [],
      preferredVet: preferredVet.trim() || undefined,
      createdAt: new Date().toISOString()
    };

    onAdd(newPet);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-sheet animate-fade-in" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{isEditing ? `Chỉnh sửa hồ sơ: ${initialPet?.name}` : 'Thêm Thú Cưng Mới'}</h3>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="species-row">
            <button
              type="button"
              className={`species-btn ${species === 'dog' ? 'active' : ''}`}
              onClick={() => {
                setSpecies('dog');
                setAvatar('https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80');
              }}
            >
              🐶 Chó
            </button>
            <button
              type="button"
              className={`species-btn ${species === 'cat' ? 'active' : ''}`}
              onClick={() => {
                setSpecies('cat');
                setAvatar('https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80');
              }}
            >
              🐱 Mèo
            </button>
            <button
              type="button"
              className={`species-btn ${species === 'other' ? 'active' : ''}`}
              onClick={() => {
                setSpecies('other');
                setAvatar('https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=600&q=80');
              }}
            >
              🐰 Khác
            </button>
          </div>

          <div className="input-group">
            <label className="input-label">Tên thú cưng *</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="VD: Milo, Bơ, Cỏ..." 
              value={name} 
              onChange={e => setName(e.target.value)} 
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
                placeholder="VD: Vàng kem..." 
                value={coatColor} 
                onChange={e => setCoatColor(e.target.value)} 
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Ngày sinh hoặc Tuổi</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="VD: 2024-05-10 hoặc 2 tuổi" 
              value={estimatedAge} 
              onChange={e => setEstimatedAge(e.target.value)} 
            />
          </div>

          <div className="input-group">
            <label className="input-label">Mã Microchip</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="VD: VN-982000..." 
              value={microchip} 
              onChange={e => setMicrochip(e.target.value)} 
            />
          </div>

          <div className="input-group">
            <label className="input-label">Dị ứng ghi nhận (nếu có)</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="VD: Dị ứng thịt bò, cá..." 
              value={allergies} 
              onChange={e => setAllergies(e.target.value)} 
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-outline" onClick={onClose}>Hủy</button>
            <button type="submit" className="btn-primary">Lưu thú cưng</button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface AddWeightModalProps {
  isOpen: boolean;
  activePet: Pet | null;
  onClose: () => void;
  onAdd: (record: WeightRecord) => void;
}

export const AddWeightModal: React.FC<AddWeightModalProps> = ({ isOpen, activePet, onClose, onAdd }) => {
  const [weight, setWeight] = useState<number>(activePet?.weight || 5.0);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');

  if (!isOpen || !activePet) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!weight) return;

    const record: WeightRecord = {
      id: 'w_' + Date.now(),
      petId: activePet.id,
      date,
      weight: Number(weight),
      note: note.trim() || undefined
    };

    onAdd(record);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-sheet animate-fade-in" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Ghi Cân Nặng cho {activePet.name}</h3>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="input-group">
            <label className="input-label">Cân nặng hiện tại (kg) *</label>
            <input 
              type="number" 
              step="0.1" 
              className="input-field" 
              value={weight} 
              onChange={e => setWeight(parseFloat(e.target.value) || 0)} 
              required 
            />
          </div>

          <div className="input-group">
            <label className="input-label">Ngày cân *</label>
            <input 
              type="date" 
              className="input-field" 
              value={date} 
              onChange={e => setDate(e.target.value)} 
              required 
            />
          </div>

          <div className="input-group">
            <label className="input-label">Ghi chú (tùy chọn)</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="VD: Sau khi đi bơi, đổi hạt mới..." 
              value={note} 
              onChange={e => setNote(e.target.value)} 
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-outline" onClick={onClose}>Hủy</button>
            <button type="submit" className="btn-primary">Lưu cân nặng</button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface AddPhotoModalProps {
  isOpen: boolean;
  activePet: Pet | null;
  onClose: () => void;
  onAdd: (photo: PetPhoto) => void;
}

export const AddPhotoModal: React.FC<AddPhotoModalProps> = ({ isOpen, activePet, onClose, onAdd }) => {
  const [photoUrl, setPhotoUrl] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');
  const [weightAtTime, setWeightAtTime] = useState<number>(activePet?.weight || 5.0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadError, setUploadError] = useState('');
  
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const cameraInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isOpen) {
      setPhotoUrl('');
      setNote('');
      setUploadError('');
      if (activePet) {
        setWeightAtTime(activePet.weight || 5.0);
      }
    }
  }, [isOpen, activePet]);

  if (!isOpen || !activePet) return null;

  // Compress image before saving to local/uploading to ensure fast performance on phones
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Vui lòng chọn file hình ảnh hợp lệ (PNG, JPG, HEIC...)');
      return;
    }

    setUploadError('');
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
          setPhotoUrl(dataUrl);
        } else {
          setPhotoUrl(event.target?.result as string);
        }
        setIsProcessing(false);
      };
      img.onerror = () => {
        setUploadError('Không thể nạp ảnh. Vui lòng thử lại.');
        setIsProcessing(false);
      };
      img.src = event.target?.result as string;
    };
    reader.onerror = () => {
      setUploadError('Đọc file thất bại.');
      setIsProcessing(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoUrl.trim()) {
      setUploadError('Vui lòng chụp ảnh hoặc tải ảnh lên trước khi lưu');
      return;
    }

    const newPhoto: PetPhoto = {
      id: 'photo_' + Date.now(),
      petId: activePet.id,
      date,
      photoUrl: photoUrl.trim(),
      note: note.trim() || undefined,
      weightAtTime: Number(weightAtTime) || undefined
    };

    onAdd(newPhoto);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-sheet animate-fade-in" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Thêm Ảnh Phát Triển cho {activePet.name}</h3>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {/* Hidden native inputs for Camera & Gallery */}
          <input 
            type="file" 
            ref={cameraInputRef} 
            accept="image/*" 
            capture="environment" 
            style={{ display: 'none' }} 
            onChange={handleFileChange} 
          />
          <input 
            type="file" 
            ref={fileInputRef} 
            accept="image/*" 
            style={{ display: 'none' }} 
            onChange={handleFileChange} 
          />

          {/* Photo Preview & Capture Actions */}
          <div className="input-group">
            <label className="input-label">Ảnh kỷ niệm thú cưng *</label>
            
            {photoUrl ? (
              <div className="photo-preview-container">
                <img src={photoUrl} alt="Preview" className="photo-preview-img" />
                <div className="preview-overlay-actions">
                  <button 
                    type="button" 
                    className="preview-action-btn"
                    onClick={() => cameraInputRef.current?.click()}
                  >
                    📸 Chụp lại
                  </button>
                  <button 
                    type="button" 
                    className="preview-action-btn secondary"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    🖼️ Chọn ảnh khác
                  </button>
                </div>
              </div>
            ) : (
              <div className="photo-picker-box">
                {isProcessing ? (
                  <div className="photo-processing-state">
                    <span className="spinner-dots">Đang xử lý ảnh...</span>
                  </div>
                ) : (
                  <>
                    <p className="picker-guide-text">Chụp ngay bằng camera hoặc tải ảnh từ thư viện máy</p>
                    <div className="picker-btn-row">
                      <button 
                        type="button" 
                        className="picker-cta-btn camera"
                        onClick={() => cameraInputRef.current?.click()}
                      >
                        <span className="icon">📸</span>
                        <span>Mở Camera chụp ngay</span>
                      </button>
                      <button 
                        type="button" 
                        className="picker-cta-btn gallery"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <span className="icon">🖼️</span>
                        <span>Chọn từ Thư viện</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {uploadError && <p className="error-text" style={{ color: 'var(--emergency)', fontSize: '0.78rem', marginTop: 4 }}>{uploadError}</p>}
          </div>

          <div className="grid-2">
            <div className="input-group">
              <label className="input-label">Ngày chụp *</label>
              <input 
                type="date" 
                className="input-field" 
                value={date} 
                onChange={e => setDate(e.target.value)} 
                required 
              />
            </div>
            <div className="input-group">
              <label className="input-label">Cân nặng lúc này (kg)</label>
              <input 
                type="number" 
                step="0.1" 
                className="input-field" 
                value={weightAtTime} 
                onChange={e => setWeightAtTime(parseFloat(e.target.value) || 0)} 
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Ghi chú kỷ niệm</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="VD: Bé tròn 1 tuổi, lần đầu đi dạo biển, mới cạo lông..." 
              value={note} 
              onChange={e => setNote(e.target.value)} 
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-outline" onClick={onClose}>Hủy</button>
            <button 
              type="submit" 
              className="btn-primary"
              disabled={!photoUrl || isProcessing}
            >
              {isProcessing ? 'Đang xử lý...' : 'Lưu ảnh vào timeline'}
            </button>
          </div>
        </form>

        <style>{`
          .photo-picker-box {
            border: 2px dashed var(--border-color);
            background: var(--bg-main);
            border-radius: var(--radius-lg);
            padding: 24px 16px;
            text-align: center;
            display: flex;
            flex-direction: column;
            gap: 14px;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
          }

          .picker-guide-text {
            font-size: 0.84rem;
            color: var(--text-muted);
            font-weight: 500;
          }

          .picker-btn-row {
            display: flex;
            gap: 10px;
            width: 100%;
            justify-content: center;
            flex-wrap: wrap;
          }

          .picker-cta-btn {
            flex: 1;
            min-width: 140px;
            padding: 10px 14px;
            border-radius: var(--radius-md);
            font-weight: 600;
            font-size: 0.85rem;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            cursor: pointer;
            transition: all var(--transition-fast);
          }

          .picker-cta-btn.camera {
            background: var(--primary);
            color: #ffffff;
            box-shadow: 0 4px 10px rgba(20, 154, 140, 0.25);
          }

          .picker-cta-btn.camera:hover {
            background: var(--primary-dark);
          }

          .picker-cta-btn.gallery {
            background: var(--bg-card);
            color: var(--text-main);
            border: 1.5px solid var(--border-color);
          }

          .picker-cta-btn.gallery:hover {
            border-color: var(--primary);
            color: var(--primary);
          }

          .photo-preview-container {
            position: relative;
            border-radius: var(--radius-lg);
            overflow: hidden;
            border: 1.5px solid var(--border-color);
            background: #000000;
            max-height: 260px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .photo-preview-img {
            width: 100%;
            max-height: 260px;
            object-fit: contain;
          }

          .preview-overlay-actions {
            position: absolute;
            bottom: 10px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 8px;
            width: calc(100% - 20px);
            justify-content: center;
          }

          .preview-action-btn {
            background: rgba(15, 23, 42, 0.85);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            color: #ffffff;
            padding: 6px 14px;
            border-radius: var(--radius-full);
            font-size: 0.78rem;
            font-weight: 600;
            border: 1px solid rgba(255, 255, 255, 0.2);
          }

          .preview-action-btn:hover {
            background: rgba(15, 23, 42, 1);
          }
        `}</style>
      </div>
    </div>
  );
};
