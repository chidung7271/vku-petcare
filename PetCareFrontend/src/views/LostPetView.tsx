import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { LostPetReport, PetSpecies, PetGender } from '../types';
import { apiClient } from '../services/apiClient';
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
  FileCheck,
  UploadCloud,
  Loader2,
  CheckCircle2,
  Image as ImageIcon,
  Trash2
} from 'lucide-react';

interface LostPetViewProps {
  lostPets: LostPetReport[];
  onAddLostPet: (report: LostPetReport) => void;
  onDeleteLostPet?: (id: string) => void;
  onShowToast: (text: string, type: 'success' | 'warning' | 'info' | 'error') => void;
}

export const LostPetView: React.FC<LostPetViewProps> = ({
  lostPets,
  onAddLostPet,
  onDeleteLostPet,
  onShowToast
}) => {
  const [activeTab, setActiveTab] = useState<'lost' | 'found'>('lost');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedPoster, setSelectedPoster] = useState<LostPetReport | null>(null);

  // New report form state
  const [reportType, setReportType] = useState<'lost' | 'found'>('lost');
  const [petName, setPetName] = useState('');
  const [species, setSpecies] = useState<PetSpecies>('dog');
  const [breed, setBreed] = useState('');
  const [color, setColor] = useState('');
  const [gender, setGender] = useState<PetGender>('male');
  const [lastSeenLocation, setLastSeenLocation] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [reward, setReward] = useState('');
  const [notes, setNotes] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const handleOpenReportModal = () => {
    setReportType(activeTab);
    setPetName('');
    setBreed('');
    setColor('');
    setLastSeenLocation('');
    setContactPhone('');
    setReward('');
    setNotes('');
    setPhotoUrl('');
    setIsReportModalOpen(true);
  };

  const handleUploadPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check image type (handling iOS/iPhone files)
    if (file.type && !file.type.startsWith('image/')) {
      onShowToast('Vui lòng chọn tệp hình ảnh hợp lệ (PNG, JPG, HEIC...)', 'warning');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      onShowToast('Dung lượng ảnh không được vượt quá 20MB', 'warning');
      return;
    }

    setIsUploadingPhoto(true);

    // Read and compress image locally so iPhone photos always show up immediately
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = async () => {
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
        let localDataUrl = event.target?.result as string;
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          localDataUrl = canvas.toDataURL('image/jpeg', 0.85);
        }

        // Set locally immediately
        setPhotoUrl(localDataUrl);
        setIsUploadingPhoto(false);
        onShowToast('Đã nạp ảnh thú cưng thành công! 📸', 'success');

        // Asynchronously try uploading to Backend cloud if possible
        try {
          const res = await apiClient.uploadImage(file, 'lost-pets');
          const cloudUrl = res?.data?.url || (res as any)?.url;
          if (cloudUrl) {
            setPhotoUrl(cloudUrl);
          }
        } catch {
          // Keep the compressed localDataUrl fallback safely
        }
      };

      img.onerror = () => {
        setIsUploadingPhoto(false);
        // Fallback to direct raw base64 if canvas decode fails
        const rawResult = event.target?.result as string;
        if (rawResult) {
          setPhotoUrl(rawResult);
          onShowToast('Đã nạp ảnh thú cưng! 📸', 'success');
        } else {
          onShowToast('Không thể giải mã hình ảnh từ máy', 'warning');
        }
      };

      img.src = event.target?.result as string;
    };

    reader.onerror = () => {
      setIsUploadingPhoto(false);
      onShowToast('Lỗi khi đọc file ảnh từ máy', 'error');
    };

    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const filteredList = lostPets.filter(p => p.status === activeTab);

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!petName.trim() || !contactPhone.trim() || !lastSeenLocation.trim()) return;

    const defaultImg = species === 'cat'
      ? 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80'
      : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80';

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
      photoUrl: photoUrl.trim() || defaultImg,
      status: reportType,
      createdAt: new Date().toISOString()
    };

    onAddLostPet(newReport);
    setActiveTab(reportType);
    setIsReportModalOpen(false);
    setSelectedPoster(newReport);
    onShowToast('Đã đăng tin và tạo áp phích (poster) thành công!', 'success');
  };

  const handleSharePoster = (report: LostPetReport) => {
    const prefix = report.status === 'found' ? '[CƯU MANG THÚ CƯNG LẠC]' : '[TÌM THÚ CƯNG THẤT LẠC]';
    const locPrefix = report.status === 'found' ? 'Nhặt được tại' : 'Bị lạc tại';
    const text = `${prefix} Bé ${report.petName} (${report.breed}, màu ${report.color}) ${locPrefix} ${report.lastSeenLocation}. Xin liên hệ SĐT: ${report.contactPhone}${report.reward ? ` - Hậu tạ: ${report.reward}` : ''}`;
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

        <button className="btn-primary-lost" onClick={handleOpenReportModal}>
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
          🔍 Thú cưng cần tìm chủ ({lostPets.filter(p => p.status === 'lost').length})
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

                  <button className="btn-share-icon" onClick={() => handleSharePoster(report)} title="Chia sẻ poster">
                    <Share2 size={16} />
                  </button>

                  {onDeleteLostPet && (
                    <button 
                      className="btn-delete-report" 
                      onClick={() => {
                        if (window.confirm(`Bạn có chắc chắn muốn xóa tin báo "${report.petName}" không? Tin sẽ được gỡ khỏi danh sách tìm kiếm.`)) {
                          onDeleteLostPet(report.id);
                        }
                      }}
                      title="Xóa tin báo (Đã tìm thấy hoặc gỡ tin)"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
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
      {selectedPoster && createPortal(
        <div 
          className="modal-backdrop" 
          onClick={() => setSelectedPoster(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
        >
          <div 
            className="modal-sheet poster-modal animate-fade-in" 
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '520px',
              height: '88vh',
              maxHeight: '92vh',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              borderRadius: '1.25rem',
              background: 'var(--bg-card)',
              zIndex: 100000
            }}
          >
            <div className="modal-header" style={{ flexShrink: 0 }}>
              <h3 className="modal-title">Áp Phích Tìm Thú Cưng</h3>
              <button className="modal-close-btn" onClick={() => setSelectedPoster(null)}>✕</button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '16px' }}>
              <div className="poster-printable-area" id="printable-poster">
                <div className="poster-head-banner">
                  <h1>{selectedPoster.status === 'found' ? 'TÌM CHỦ CHO BÉ CƯU MANG' : 'TÌM THÚ CƯNG THẤT LẠC'}</h1>
                  <p>{selectedPoster.status === 'found' ? 'BÉ ĐANG ĐƯỢC CHĂM SÓC AN TOÀN - XIN HÃY LIÊN HỆ ĐOÀN TỤ' : 'XIN HÃY GIÚP GIA ĐÌNH CHÚNG TÔI ĐOÀN TỤ'}</p>
                </div>

                <div className="poster-photo-wrap">
                  <img src={selectedPoster.photoUrl} alt={selectedPoster.petName} className="poster-img" />
                </div>

                <div className="poster-body">
                  <h2 className="poster-name">{selectedPoster.petName}</h2>
                  <p className="poster-breed">{selectedPoster.breed} • Màu lông: {selectedPoster.color}</p>
                  
                  <div className="poster-box location-box">
                    <strong>{selectedPoster.status === 'found' ? '📍 KHU VỰC NHẶT ĐƯỢC BÉ:' : '📍 KHU VỰC THẤT LẠC:'}</strong>
                    <p>{selectedPoster.lastSeenLocation} (lúc {selectedPoster.lastSeenDate})</p>
                  </div>

                  {selectedPoster.notes && (
                    <div className="poster-box">
                      <strong>ĐẶC ĐIỂM NHẬN DẠNG / TÌNH TRẠNG:</strong>
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
                      <span className="call-title">{selectedPoster.status === 'found' ? 'LIÊN HỆ NGƯỜI CƯU MANG:' : 'LIÊN HỆ TRỰC TIẾP:'}</span>
                      <span className="phone-big">{selectedPoster.contactPhone}</span>
                    </div>
                    <div className="qr-box">
                      <QrCode size={44} />
                      <span>Quét liên hệ</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div 
              className="modal-footer"
              style={{
                flexShrink: 0,
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '0.75rem',
                padding: '0.85rem 1.25rem',
                background: 'var(--bg-card)',
                borderTop: '1px solid var(--border-color)',
                zIndex: 10
              }}
            >
              <button className="btn-outline" onClick={() => handleSharePoster(selectedPoster)}>
                <Share2 size={16} />
                <span>Chia sẻ tin</span>
              </button>
              <button 
                onClick={() => {
                  window.print();
                }}
                style={{
                  background: '#149a8c',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '0.5rem',
                  padding: '0.6rem 1.25rem',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  cursor: 'pointer'
                }}
              >
                <Download size={16} />
                <span>In / Tải áp phích (PDF)</span>
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* New Report Modal */}
      {isReportModalOpen && createPortal(
        <div 
          className="modal-backdrop" 
          onClick={() => setIsReportModalOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
        >
          <div 
            className="modal-sheet animate-fade-in" 
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '520px',
              height: '88vh',
              maxHeight: '92vh',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              borderRadius: '1.25rem',
              boxShadow: '0 20px 45px rgba(0,0,0,0.3)',
              background: 'var(--bg-card)',
              zIndex: 100000
            }}
          >
            {/* Modal Header */}
            <div className="modal-header" style={{ flexShrink: 0, padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 className="modal-title" style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ color: '#149a8c' }}>🐾</span> Đăng Tin Thú Cưng Thất Lạc
              </h3>
              <button className="modal-close-btn" onClick={() => setIsReportModalOpen(false)}>✕</button>
            </div>

            {/* Modal Form */}
            <form 
              onSubmit={handleSubmitReport} 
              style={{
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                minHeight: 0,
                overflow: 'hidden'
              }}
            >
              {/* Scrollable Form Body */}
              <div 
                className="modal-body" 
                style={{
                  flex: 1,
                  overflowY: 'auto',
                  WebkitOverflowScrolling: 'touch',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.9rem'
                }}
              >
                {/* 1. Chọn loại tin đăng: Thú cưng đi lạc vs Đang được cưu mang */}
                <div className="input-group">
                  <label className="input-label" style={{ fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-main)' }}>
                    Mục đích đăng tin *
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                    <button
                      type="button"
                      onClick={() => setReportType('lost')}
                      style={{
                        padding: '0.8rem 0.6rem',
                        borderRadius: '0.65rem',
                        border: reportType === 'lost' ? '2px solid #149a8c' : '1.5px solid var(--border-color)',
                        background: reportType === 'lost' ? 'rgba(20, 154, 140, 0.09)' : 'var(--bg-card)',
                        color: reportType === 'lost' ? '#0f766e' : 'var(--text-muted)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.25rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: reportType === 'lost' ? '0 2px 8px rgba(20, 154, 140, 0.15)' : 'none'
                      }}
                    >
                      <span style={{ fontSize: '1.3rem' }}>🔍</span>
                      <strong style={{ fontSize: '0.82rem' }}>Thú cưng đi lạc</strong>
                      <span style={{ fontSize: '0.68rem', opacity: 0.85 }}>Cần tìm lại bé</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setReportType('found')}
                      style={{
                        padding: '0.8rem 0.6rem',
                        borderRadius: '0.65rem',
                        border: reportType === 'found' ? '2px solid #149a8c' : '1.5px solid var(--border-color)',
                        background: reportType === 'found' ? 'rgba(20, 154, 140, 0.09)' : 'var(--bg-card)',
                        color: reportType === 'found' ? '#0f766e' : 'var(--text-muted)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.25rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: reportType === 'found' ? '0 2px 8px rgba(20, 154, 140, 0.15)' : 'none'
                      }}
                    >
                      <span style={{ fontSize: '1.3rem' }}>💚</span>
                      <strong style={{ fontSize: '0.82rem' }}>Đang cưu mang</strong>
                      <span style={{ fontSize: '0.68rem', opacity: 0.85 }}>Nhặt được pet thất lạc</span>
                    </button>
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label">
                    {reportType === 'found' ? 'Tên gọi tạm hoặc nhận dạng thú cưng *' : 'Tên thú cưng *'}
                  </label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder={reportType === 'found' ? 'VD: Bé Mướp vàng, Poodle xám...' : 'VD: Bơ, Milo...'} 
                    value={petName} 
                    onChange={e => setPetName(e.target.value)} 
                    required 
                  />
                </div>

                <div className="grid-2">
                  <div className="input-group">
                    <label className="input-label">Loài thú cưng</label>
                    <select 
                      className="input-field" 
                      value={species} 
                      onChange={e => setSpecies(e.target.value as PetSpecies)}
                      style={{ height: '42px' }}
                    >
                      <option value="dog">🐶 Loài Chó</option>
                      <option value="cat">🐱 Loài Mèo</option>
                      <option value="other">🐾 Loài khác</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label className="input-label">Giới tính</label>
                    <select 
                      className="input-field" 
                      value={gender} 
                      onChange={e => setGender(e.target.value as PetGender)}
                      style={{ height: '42px' }}
                    >
                      <option value="male">Đực</option>
                      <option value="female">Cái</option>
                    </select>
                  </div>
                </div>

                <div className="grid-2">
                  <div className="input-group">
                    <label className="input-label">Giống loài</label>
                    <input 
                      type="text" 
                      className="input-field" 
                      placeholder="VD: Corgi, Poodle, Mèo Ta..." 
                      value={breed} 
                      onChange={e => setBreed(e.target.value)} 
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Màu lông</label>
                    <input 
                      type="text" 
                      className="input-field" 
                      placeholder="VD: Vàng trắng, Đen, Xám..." 
                      value={color} 
                      onChange={e => setColor(e.target.value)} 
                    />
                  </div>
                </div>

                {/* Photo Upload from device */}
                <div className="input-group">
                  <label className="input-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>Hình ảnh thú cưng</span>
                    {isUploadingPhoto && (
                      <span style={{ fontSize: '0.75rem', color: '#149a8c', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                        <Loader2 size={13} className="animate-spin" /> Đang tải ảnh...
                      </span>
                    )}
                  </label>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    {photoUrl ? (
                      <img 
                        src={photoUrl} 
                        alt="Ảnh thú cưng" 
                        style={{ width: '60px', height: '60px', borderRadius: '0.5rem', objectFit: 'cover', border: '2px solid #149a8c', flexShrink: 0 }} 
                      />
                    ) : (
                      <div style={{ width: '60px', height: '60px', borderRadius: '0.5rem', background: 'var(--bg-main)', border: '1.5px dashed var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', flexShrink: 0 }}>
                        <ImageIcon size={24} />
                      </div>
                    )}
                    <label style={{
                      flex: 1,
                      padding: '0.65rem 0.8rem',
                      borderRadius: '0.5rem',
                      border: '1.5px dashed #149a8c',
                      background: 'rgba(20, 154, 140, 0.05)',
                      color: '#0f766e',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
                      transition: 'all 0.2s ease'
                    }}>
                      <UploadCloud size={16} />
                      <span>{isUploadingPhoto ? 'Đang tải lên...' : 'Chọn ảnh từ thiết bị'}</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleUploadPhoto} 
                        style={{ display: 'none' }} 
                      />
                    </label>
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label">
                    {reportType === 'found' ? 'Khu vực nhặt được / nhìn thấy bé *' : 'Khu vực thất lạc *'}
                  </label>
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
                  <label className="input-label">
                    {reportType === 'found' ? 'Số điện thoại người đang cưu mang *' : 'Số điện thoại liên hệ chủ nuôi *'}
                  </label>
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
                  <label className="input-label">
                    {reportType === 'found' ? 'Chi phí hỗ trợ / Tiền bàn giao (nếu có)' : 'Phần thưởng / Hậu tạ (nếu có)'}
                  </label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder={reportType === 'found' ? 'VD: Miễn phí, hoặc hỗ trợ tiền thuốc men...' : 'VD: 5.000.000 VNĐ, có quà cảm ơn...'} 
                    value={reward} 
                    onChange={e => setReward(e.target.value)} 
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Đặc điểm nhận dạng / Ghi chú</label>
                  <textarea 
                    className="textarea-field" 
                    rows={3}
                    placeholder="Vòng cổ màu gì, bé có nhát người không, tình trạng sức khỏe..." 
                    value={notes} 
                    onChange={e => setNotes(e.target.value)} 
                  />
                </div>
              </div>

              {/* Fixed Footer: Always visible & never cut off */}
              <div 
                className="modal-footer"
                style={{
                  flexShrink: 0,
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.85rem 1.25rem',
                  background: 'var(--bg-card)',
                  borderTop: '1px solid var(--border-color)',
                  boxShadow: '0 -2px 10px rgba(0,0,0,0.04)',
                  zIndex: 10
                }}
              >
                <button 
                  type="button" 
                  className="btn-outline" 
                  onClick={() => setIsReportModalOpen(false)}
                  style={{
                    padding: '0.65rem 1.25rem',
                    borderRadius: '0.5rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Hủy
                </button>
                <button 
                  type="submit" 
                  style={{
                    padding: '0.65rem 1.5rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    background: '#149a8c',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(20, 154, 140, 0.45)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <FileCheck size={16} />
                  <span>Đăng tin & Tạo Poster</span>
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
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

        .btn-primary-lost {
          background: var(--primary);
          color: #ffffff;
          border: none;
          border-radius: var(--radius-md);
          padding: 8px 14px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-weight: 700;
          font-size: 0.82rem;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(20, 154, 140, 0.35);
          transition: all 0.2s ease;
        }

        .btn-primary-lost:hover {
          background: var(--primary-hover);
          transform: translateY(-1px);
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
          background: linear-gradient(135deg, var(--primary) 0%, #0d7a6e 100%);
          box-shadow: 0 4px 12px rgba(20, 154, 140, 0.25);
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
          background: var(--primary);
          color: #ffffff;
          border-color: var(--primary);
          box-shadow: 0 4px 12px rgba(20, 154, 140, 0.25);
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
          background: #0f766e;
          box-shadow: 0 2px 8px rgba(15, 118, 110, 0.35);
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

        .btn-delete-report {
          width: 38px;
          height: 38px;
          border-radius: var(--radius-md);
          background: rgba(239, 68, 68, 0.08);
          color: #ef4444;
          padding: 0;
          border: 1px solid rgba(239, 68, 68, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .btn-delete-report:hover {
          background: #ef4444;
          color: #ffffff;
        }

        /* Printable Poster */
        .poster-printable-area {
          background: #ffffff;
          color: #0f172a;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          border: 3px solid #149a8c;
          border-radius: 8px;
        }

        .poster-head-banner {
          background: linear-gradient(135deg, #149a8c 0%, #0d7a6e 100%);
          color: #ffffff;
          text-align: center;
          padding: 12px;
          border-radius: 6px;
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
          color: #0f766e;
          font-weight: 800;
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
          background: linear-gradient(135deg, #149a8c 0%, #0d7a6e 100%);
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

        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-poster, #printable-poster * {
            visibility: visible !important;
          }
          #printable-poster {
            position: fixed !important;
            left: 50% !important;
            top: 10px !important;
            transform: translateX(-50%) !important;
            width: 100% !important;
            max-width: 640px !important;
            margin: 0 !important;
            box-shadow: none !important;
            border: 3px solid #149a8c !important;
          }
        }
      `}</style>
    </div>
  );
};
