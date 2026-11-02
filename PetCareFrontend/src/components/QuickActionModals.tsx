import React, { useState } from 'react';
import { Camera, UploadCloud, Loader2 } from 'lucide-react';
import { Pet, PetSpecies, PetGender, WeightRecord, PetPhoto, Reminder, ReminderType, ReminderPriority, RepeatFrequency } from '../types';
import { apiClient } from '../services/apiClient';

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
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [hasCustomAvatar, setHasCustomAvatar] = useState(Boolean(initialPet?.avatar));
  const [microchip, setMicrochip] = useState(initialPet?.microchip || '');
  const [isNeutered, setIsNeutered] = useState(initialPet?.isNeutered || false);
  const [allergies, setAllergies] = useState(initialPet?.allergies?.join(', ') || '');
  const [preferredVet, setPreferredVet] = useState(initialPet?.preferredVet || '');
  const [chronicConditions, setChronicConditions] = useState(initialPet?.chronicConditions?.join(', ') || '');
  const [currentMedications, setCurrentMedications] = useState(initialPet?.currentMedications?.join(', ') || '');

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
      setHasCustomAvatar(Boolean(initialPet.avatar));
      setMicrochip(initialPet.microchip || '');
      setIsNeutered(initialPet.isNeutered || false);
      setAllergies(initialPet.allergies?.join(', ') || '');
      setPreferredVet(initialPet.preferredVet || '');
      setChronicConditions(initialPet.chronicConditions?.join(', ') || '');
      setCurrentMedications(initialPet.currentMedications?.join(', ') || '');
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
      setHasCustomAvatar(false);
      setMicrochip('');
      setIsNeutered(false);
      setAllergies('');
      setPreferredVet('');
      setChronicConditions('');
      setCurrentMedications('');
    }
  }, [initialPet, isOpen]);

  const handleUploadAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type && !file.type.startsWith('image/')) {
      return;
    }

    setIsUploadingAvatar(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        const MAX_DIM = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_DIM) {
            height *= MAX_DIM / width;
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width *= MAX_DIM / height;
            height = MAX_DIM;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        let localDataUrl = event.target?.result as string;
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          localDataUrl = canvas.toDataURL('image/jpeg', 0.88);
        }

        setAvatar(localDataUrl);
        setHasCustomAvatar(true);
        setIsUploadingAvatar(false);

        try {
          const res = await apiClient.uploadImage(file, 'pets');
          const cloudUrl = res?.data?.url || (res as any)?.url;
          if (cloudUrl) {
            setAvatar(cloudUrl);
          }
        } catch {
          // Keep localDataUrl
        }
      };

      img.onerror = () => {
        setIsUploadingAvatar(false);
        const raw = event.target?.result as string;
        if (raw) {
          setAvatar(raw);
          setHasCustomAvatar(true);
        }
      };

      img.src = event.target?.result as string;
    };

    reader.onerror = () => {
      setIsUploadingAvatar(false);
    };

    reader.readAsDataURL(file);
    e.target.value = '';
  };

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
        chronicConditions: chronicConditions ? chronicConditions.split(',').map(s => s.trim()).filter(Boolean) : [],
        currentMedications: currentMedications ? currentMedications.split(',').map(s => s.trim()).filter(Boolean) : [],
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
      chronicConditions: chronicConditions ? chronicConditions.split(',').map(s => s.trim()).filter(Boolean) : [],
      currentMedications: currentMedications ? currentMedications.split(',').map(s => s.trim()).filter(Boolean) : [],
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

        <form onSubmit={handleSubmit} className="modal-form-wrapper" style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}>
          <div className="modal-body" style={{ overflowY: 'auto', flex: '1 1 auto', WebkitOverflowScrolling: 'touch', padding: '20px' }}>
            {/* Avatar Upload Banner */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: '12px 14px',
              borderRadius: '16px',
              background: 'var(--bg-main)',
              border: '1px solid var(--border-color)',
              marginBottom: '16px'
            }}>
              <div style={{ position: 'relative', width: '68px', height: '68px', flexShrink: 0 }}>
                <img 
                  src={avatar} 
                  alt={name || 'Avatar thú cưng'} 
                  style={{
                    width: '68px',
                    height: '68px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2.5px solid #149a8c',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }} 
                />
                <label 
                  style={{
                    position: 'absolute',
                    bottom: '-2px',
                    right: '-2px',
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    background: '#149a8c',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
                    border: '2px solid #ffffff'
                  }}
                  title="Tải ảnh mới làm Avatar"
                >
                  <Camera size={13} />
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleUploadAvatar} 
                    style={{ display: 'none' }} 
                  />
                </label>
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                  <strong style={{ fontSize: '0.88rem', color: 'var(--text-main)' }}>Ảnh đại diện của bé</strong>
                  {isUploadingAvatar && (
                    <span style={{ fontSize: '0.72rem', color: '#149a8c', display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <Loader2 size={12} className="animate-spin" /> Đang tải...
                    </span>
                  )}
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.35 }}>
                  Chạm vào máy ảnh hoặc tải ảnh từ máy để làm avatar đại diện
                </p>
                <label style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  marginTop: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#0f766e',
                  cursor: 'pointer'
                }}>
                  <UploadCloud size={13} />
                  <span>Chọn ảnh từ thiết bị</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleUploadAvatar} 
                    style={{ display: 'none' }} 
                  />
                </label>
              </div>
            </div>

            <div className="species-row">
            <button
              type="button"
              className={`species-btn ${species === 'dog' ? 'active' : ''}`}
              onClick={() => {
                setSpecies('dog');
                if (!hasCustomAvatar) {
                  setAvatar('https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80');
                }
              }}
            >
              🐶 Chó
            </button>
            <button
              type="button"
              className={`species-btn ${species === 'cat' ? 'active' : ''}`}
              onClick={() => {
                setSpecies('cat');
                if (!hasCustomAvatar) {
                  setAvatar('https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80');
                }
              }}
            >
              🐱 Mèo
            </button>
            <button
              type="button"
              className={`species-btn ${species === 'other' ? 'active' : ''}`}
              onClick={() => {
                setSpecies('other');
                if (!hasCustomAvatar) {
                  setAvatar('https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=600&q=80');
                }
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
            <label className="input-label">Phòng khám / Bác sĩ quen</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="VD: BV Thú Y PetHealth - BS. Minh Đức" 
              value={preferredVet} 
              onChange={e => setPreferredVet(e.target.value)} 
            />
          </div>

          <div className="input-group" style={{ marginBottom: '14px' }}>
            <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '6px 0' }}>
              <input 
                type="checkbox" 
                checked={isNeutered} 
                onChange={e => setIsNeutered(e.target.checked)} 
                style={{ width: '18px', height: '18px', accentColor: '#149a8c' }}
              />
              <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)' }}>Đã triệt sản</span>
            </label>
          </div>

          <div className="input-group">
            <label className="input-label">Dị ứng ghi nhận (nếu có)</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="VD: Dị ứng thịt bò, phấn hoa..." 
              value={allergies} 
              onChange={e => setAllergies(e.target.value)} 
            />
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px', display: 'block' }}>
              Phân cách bằng dấu phẩy nếu có nhiều dị ứng
            </span>
          </div>

          <div className="input-group">
            <label className="input-label">Bệnh nền / Tiền sử bệnh lý (nếu có)</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="VD: Viêm da dị ứng mùa mưa, Hen phế quản, Bệnh thận..." 
              value={chronicConditions} 
              onChange={e => setChronicConditions(e.target.value)} 
            />
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px', display: 'block' }}>
              Phân cách bằng dấu phẩy nếu có nhiều bệnh nền
            </span>
          </div>

          <div className="input-group">
            <label className="input-label">Thuốc đang sử dụng (nếu có)</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="VD: NexGard Spectra hàng tháng, Thuốc trị nấm..." 
              value={currentMedications} 
              onChange={e => setCurrentMedications(e.target.value)} 
            />
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px', display: 'block' }}>
              Phân cách bằng dấu phẩy nếu dùng nhiều loại thuốc
            </span>
          </div>
        </div>

        <div className="modal-footer" style={{ flexShrink: 0 }}>
          <button type="button" className="btn-outline" onClick={onClose}>Hủy</button>
          <button type="submit" className="btn-primary">{isEditing ? 'Lưu thay đổi' : 'Lưu thú cưng'}</button>
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

        <form onSubmit={handleSubmit} className="modal-form-wrapper" style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}>
          <div className="modal-body" style={{ overflowY: 'auto', flex: '1 1 auto', WebkitOverflowScrolling: 'touch', padding: '20px' }}>
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
          </div>

          <div className="modal-footer" style={{ flexShrink: 0 }}>
            <button type="button" className="btn-outline" onClick={onClose}>Hủy</button>
            <button type="submit" className="btn-primary">Lưu cân nặng</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export interface GrowthMilestoneInput {
  weight?: number;
  photoUrl?: string;
  date?: string;
  note?: string;
}

interface AddPhotoModalProps {
  isOpen: boolean;
  activePet: Pet | null;
  onClose: () => void;
  onAdd?: (photo: PetPhoto) => void;
  onAddMilestone?: (milestone: GrowthMilestoneInput) => void;
}

export const AddPhotoModal: React.FC<AddPhotoModalProps> = ({ 
  isOpen, 
  activePet, 
  onClose, 
  onAdd,
  onAddMilestone 
}) => {
  const [photoUrl, setPhotoUrl] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');
  const [weightAtTime, setWeightAtTime] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadError, setUploadError] = useState('');
  
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const cameraInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isOpen) {
      setPhotoUrl('');
      setNote('');
      setDate(new Date().toISOString().split('T')[0]);
      setUploadError('');
      if (activePet && activePet.weight) {
        setWeightAtTime(String(activePet.weight));
      } else {
        setWeightAtTime('');
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
    setUploadError('');

    const hasPhoto = Boolean(photoUrl && photoUrl.trim());
    const parsedWeight = parseFloat(weightAtTime);
    const hasWeight = !isNaN(parsedWeight) && parsedWeight > 0;
    const hasNote = Boolean(note && note.trim());

    // 1. Validation: Không trường nào được điền thì hủy / chặn submit
    if (!hasPhoto && !hasWeight && !hasNote) {
      setUploadError('Vui lòng nhập ít nhất một thông tin (cân nặng, ghi chú hoặc ảnh kỷ niệm) hoặc bấm Hủy để đóng.');
      return;
    }

    // 2. Validation: Ngày chụp là không bắt buộc nếu không có ảnh, nhưng CÓ ẢNH THÌ BẮT BUỘC
    if (hasPhoto && (!date || !date.trim())) {
      setUploadError('Ngày chụp là bắt buộc khi có đính kèm ảnh kỷ niệm.');
      return;
    }

    const recordDate = date && date.trim() ? date.trim() : new Date().toISOString().split('T')[0];

    if (onAddMilestone) {
      onAddMilestone({
        photoUrl: hasPhoto ? photoUrl.trim() : undefined,
        weight: hasWeight ? parsedWeight : undefined,
        date: hasPhoto || (date && date.trim()) ? recordDate : undefined,
        note: hasNote ? note.trim() : undefined,
      });
    } else if (onAdd) {
      const newPhoto: PetPhoto = {
        id: 'photo_' + Date.now(),
        petId: activePet.id,
        date: recordDate,
        photoUrl: hasPhoto ? photoUrl.trim() : '',
        note: hasNote ? note.trim() : undefined,
        weightAtTime: hasWeight ? parsedWeight : undefined,
      };
      onAdd(newPhoto);
    }

    onClose();
  };

  const hasPhoto = Boolean(photoUrl && photoUrl.trim());

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-sheet animate-fade-in" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 className="modal-title">Ghi Nhận Mốc Phát Triển cho {activePet.name}</h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
              Cân nặng mới • Ghi chú kỷ niệm • Ảnh phát triển
            </p>
          </div>
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
            <label className="input-label">
              Ảnh kỷ niệm thú cưng <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(không bắt buộc)</span>
            </label>
            
            {hasPhoto ? (
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
                  <button 
                    type="button" 
                    className="preview-action-btn"
                    style={{ background: 'rgba(220, 38, 38, 0.85)', color: '#fff' }}
                    onClick={() => setPhotoUrl('')}
                  >
                    ✕ Bỏ ảnh này
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
                    <p className="picker-guide-text">Chụp bằng camera hoặc tải ảnh từ máy (tùy chọn)</p>
                    <div className="picker-btn-row">
                      <button 
                        type="button" 
                        className="picker-cta-btn camera"
                        onClick={() => cameraInputRef.current?.click()}
                      >
                        <span className="icon">📸</span>
                        <span>Mở Camera chụp</span>
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

            {uploadError && <p className="error-text" style={{ color: 'var(--emergency)', fontSize: '0.78rem', marginTop: 6, fontWeight: 600 }}>{uploadError}</p>}
          </div>

          <div className="grid-2">
            <div className="input-group">
              <label className="input-label">
                {hasPhoto ? (
                  <>Ngày chụp <span style={{ color: 'var(--emergency)' }}>*</span> <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>(bắt buộc khi có ảnh)</span></>
                ) : (
                  <>Ngày ghi nhận <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>(tùy chọn)</span></>
                )}
              </label>
              <input 
                type="date" 
                className="input-field" 
                value={date} 
                onChange={e => setDate(e.target.value)} 
                required={hasPhoto}
              />
            </div>
            <div className="input-group">
              <label className="input-label">
                Cân nặng lúc này (kg) <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>(tùy chọn)</span>
              </label>
              <input 
                type="number" 
                step="0.1" 
                className="input-field" 
                placeholder="VD: 5.5"
                value={weightAtTime} 
                onChange={e => setWeightAtTime(e.target.value)} 
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">
              Ghi chú kỷ niệm <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>(tùy chọn)</span>
            </label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="VD: Bé tròn 1 tuổi, lần đầu đi dạo biển, tăng cân khỏe mạnh..." 
              value={note} 
              onChange={e => setNote(e.target.value)} 
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-outline" onClick={onClose}>Hủy</button>
            <button 
              type="submit" 
              className="btn-primary"
              disabled={isProcessing}
            >
              {isProcessing ? 'Đang xử lý...' : 'Lưu mốc phát triển'}
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
