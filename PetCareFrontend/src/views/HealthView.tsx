import React, { useState } from 'react';
import { Pet, HealthRecord, HealthRecordType } from '../types';
import { 
  Plus, 
  FileText, 
  Calendar, 
  CheckCircle2, 
  Search, 
  Trash2, 
  Paperclip, 
  Stethoscope, 
  Syringe, 
  Pill, 
  AlertOctagon, 
  FileCheck 
} from 'lucide-react';

interface HealthViewProps {
  activePet: Pet | null;
  records: HealthRecord[];
  onAddRecord: (record: HealthRecord) => void;
  onDeleteRecord: (id: string) => void;
}

const RECORD_CATEGORIES: { type: HealthRecordType | 'all'; label: string; icon: any }[] = [
  { type: 'all', label: 'Tất cả', icon: FileText },
  { type: 'vaccine', label: 'Vaccine', icon: Syringe },
  { type: 'checkup', label: 'Khám bệnh', icon: Stethoscope },
  { type: 'deworming', label: 'Tẩy giun', icon: CheckCircle2 },
  { type: 'medication', label: 'Đơn thuốc', icon: Pill },
  { type: 'allergy', label: 'Dị ứng', icon: AlertOctagon },
  { type: 'lab', label: 'Xét nghiệm', icon: FileCheck }
];

export const HealthView: React.FC<HealthViewProps> = ({
  activePet,
  records,
  onAddRecord,
  onDeleteRecord
}) => {
  const [selectedType, setSelectedType] = useState<HealthRecordType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form fields for new record
  const [recordType, setRecordType] = useState<HealthRecordType>('vaccine');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [nextDueDate, setNextDueDate] = useState('');
  const [vetClinic, setVetClinic] = useState('');
  const [vetDoctor, setVetDoctor] = useState('');
  const [prescription, setPrescription] = useState('');
  const [notes, setNotes] = useState('');
  const [documentUrl, setDocumentUrl] = useState('');

  const petRecords = activePet 
    ? records.filter(r => r.petId === activePet.id)
    : records;

  const filteredRecords = petRecords.filter(r => {
    const matchType = selectedType === 'all' || r.type === selectedType;
    const matchQuery = !searchQuery.trim() || 
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.vetClinic && r.vetClinic.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (r.notes && r.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchType && matchQuery;
  });

  const handleSubmitNewRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !activePet) return;

    const newRecord: HealthRecord = {
      id: 'hr_' + Date.now(),
      petId: activePet.id,
      type: recordType,
      title: title.trim(),
      date,
      nextDueDate: nextDueDate || undefined,
      vetClinic: vetClinic.trim() || undefined,
      vetDoctor: vetDoctor.trim() || undefined,
      prescription: prescription.trim() || undefined,
      notes: notes.trim() || undefined,
      documentUrl: documentUrl || undefined
    };

    onAddRecord(newRecord);
    setIsAddModalOpen(false);
    // Reset form
    setTitle('');
    setPrescription('');
    setNotes('');
    setNextDueDate('');
  };

  return (
    <>
      <div className="health-container animate-fade-in">
        {/* Header Banner */}
        <div className="health-header-card card">
          <div className="header-info">
          <div className="header-icon-box">
            <Stethoscope size={24} />
          </div>
          <div>
            <h2 className="health-title">Sổ Sức Khỏe Điện Tử</h2>
            <p className="health-subtitle">
              {activePet ? `Hồ sơ y bạ của ${activePet.name}` : 'Quản lý toàn bộ hồ sơ y tế'}
            </p>
          </div>
        </div>
        <button className="btn-primary btn-sm" onClick={() => setIsAddModalOpen(true)}>
          <Plus size={16} />
          <span>Ghi sổ mới</span>
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="category-scroll-bar">
        {RECORD_CATEGORIES.map(cat => {
          const IconComp = cat.icon;
          return (
            <button
              key={cat.type}
              className={`cat-filter-chip ${selectedType === cat.type ? 'active' : ''}`}
              onClick={() => setSelectedType(cat.type)}
            >
              <IconComp size={15} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Search Filter */}
      <div className="search-box">
        <Search size={18} className="search-icon" />
        <input 
          type="text" 
          placeholder="Tìm kiếm theo tên vaccine, phòng khám, triệu chứng..." 
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Records List */}
      <div className="records-list">
        {filteredRecords.length > 0 ? (
          filteredRecords.map(record => (
            <div key={record.id} className="record-item card">
              <div className="record-top-row">
                <div className="record-badge-wrap">
                  <span className={`badge ${
                    record.type === 'vaccine' ? 'badge-primary' : 
                    record.type === 'allergy' ? 'badge-emergency' : 
                    record.type === 'deworming' ? 'badge-success' : 'badge-warning'
                  }`}>
                    {record.type}
                  </span>
                  <span className="record-date">📅 {record.date}</span>
                </div>
                <button 
                  className="delete-rec-btn"
                  onClick={() => onDeleteRecord(record.id)}
                  title="Xóa bản ghi này"
                >
                  <Trash2 size={15} />
                </button>
              </div>

              <h4 className="record-title">{record.title}</h4>

              {(record.vetClinic || record.vetDoctor) && (
                <div className="clinic-tag">
                  🏥 {record.vetClinic} {record.vetDoctor ? `• ${record.vetDoctor}` : ''}
                </div>
              )}

              {record.prescription && (
                <div className="prescription-box">
                  <span className="pres-label">💊 Đơn thuốc / Chỉ định:</span>
                  <p className="pres-text">{record.prescription}</p>
                </div>
              )}

              {record.notes && (
                <p className="record-notes">📝 Ghi chú: {record.notes}</p>
              )}

              {record.nextDueDate && (
                <div className="next-due-pill">
                  <Calendar size={14} />
                  <span>Hạn nhắc tiếp theo: <strong>{record.nextDueDate}</strong></span>
                </div>
              )}

              {record.documentUrl && (
                <div className="doc-link-tag">
                  <Paperclip size={13} />
                  <span>Tài liệu / Phiếu kết quả đính kèm</span>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="state-container">
            <FileText size={38} className="state-icon" />
            <h4 className="state-title">Chưa có bản ghi sức khỏe nào</h4>
            <p className="state-desc">Hãy lưu lại mũi tiêm phòng đầu tiên hoặc lịch sử khám của bé để theo dõi lâu dài.</p>
            <button className="btn-primary" onClick={() => setIsAddModalOpen(true)}>
              <Plus size={16} />
              <span>Thêm bản ghi đầu tiên</span>
            </button>
          </div>
        )}
      </div>
      </div>

      {/* Add Record Modal */}
      {isAddModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsAddModalOpen(false)}>
          <div className="modal-sheet animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Ghi Sổ Sức Khỏe Mới</h3>
              <button className="modal-close-btn" onClick={() => setIsAddModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmitNewRecord} className="modal-form-wrapper">
              <div className="modal-body">
                <div className="input-group">
                  <label className="input-label">Phân loại y tế *</label>
                  <select 
                    className="select-field"
                    value={recordType}
                    onChange={e => setRecordType(e.target.value as HealthRecordType)}
                  >
                    <option value="vaccine">💉 Tiêm phòng Vaccine</option>
                    <option value="deworming">🐛 Tẩy giun / Diệt ve</option>
                    <option value="checkup">🩺 Khám sức khỏe định kỳ</option>
                    <option value="illness">🤒 Bệnh lý điều trị</option>
                    <option value="medication">💊 Đơn thuốc</option>
                    <option value="allergy">⚠️ Dị ứng</option>
                    <option value="surgery">✂️ Phẫu thuật / Triệt sản</option>
                    <option value="lab">🔬 Xét nghiệm / X-quang</option>
                  </select>
                </div>

                <div className="input-group">
                  <label className="input-label">Tiêu đề bản ghi *</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="VD: Tiêm phòng 7 bệnh Nobivac, Khám tiêu chảy..."
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="grid-2">
                  <div className="input-group">
                    <label className="input-label">Ngày thực hiện</label>
                    <input 
                      type="date" 
                      className="input-field" 
                      value={date}
                      onChange={e => setDate(e.target.value)}
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Ngày đến hạn tiếp theo</label>
                    <input 
                      type="date" 
                      className="input-field" 
                      value={nextDueDate}
                      onChange={e => setNextDueDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid-2">
                  <div className="input-group">
                    <label className="input-label">Cơ sở / Phòng khám</label>
                    <input 
                      type="text" 
                      className="input-field" 
                      placeholder="VD: BV Thú y PetHealth"
                      value={vetClinic}
                      onChange={e => setVetClinic(e.target.value)}
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Bác sĩ phụ trách</label>
                    <input 
                      type="text" 
                      className="input-field" 
                      placeholder="VD: BS. Minh Đức"
                      value={vetDoctor}
                      onChange={e => setVetDoctor(e.target.value)}
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label">Đơn thuốc / Hướng dẫn điều trị</label>
                  <textarea 
                    className="textarea-field" 
                    placeholder="Liều lượng, cách uống, kiêng khem sau tiêm..."
                    value={prescription}
                    onChange={e => setPrescription(e.target.value)}
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Ghi chú của chủ nuôi</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="Biểu hiện sau tiêm, cân nặng lúc khám..."
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-outline" onClick={() => setIsAddModalOpen(false)}>Hủy</button>
                <button type="submit" className="btn-primary">Lưu bản ghi</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .health-container {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .health-header-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 16px;
          background: var(--primary-gradient-subtle);
          border: 1px solid var(--primary-light);
        }

        .header-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .header-icon-box {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-md);
          background: var(--primary);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .health-title {
          font-size: 1.15rem;
        }

        .health-subtitle {
          font-size: 0.76rem;
          color: var(--text-muted);
        }

        .category-scroll-bar {
          display: flex;
          gap: 6px;
          overflow-x: auto;
          padding-bottom: 2px;
        }

        .cat-filter-chip {
          min-height: 36px;
          padding: 4px 12px;
          border-radius: var(--radius-full);
          border: 1px solid var(--border-color);
          background: var(--bg-card);
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
          color: var(--text-muted);
          white-space: nowrap;
        }

        .cat-filter-chip.active {
          background: var(--primary);
          color: #ffffff;
          border-color: var(--primary);
          font-weight: 700;
        }

        .records-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .record-item {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 14px;
        }

        .record-top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .record-badge-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .record-date {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .delete-rec-btn {
          min-height: 28px;
          width: 28px;
          padding: 0;
          color: var(--text-muted);
          border-radius: var(--radius-full);
        }

        .delete-rec-btn:hover {
          color: var(--emergency);
          background: var(--emergency-soft);
        }

        .record-title {
          font-size: 0.98rem;
          color: var(--text-main);
        }

        .clinic-tag {
          font-size: 0.8rem;
          color: var(--primary-dark);
          font-weight: 600;
        }

        .prescription-box {
          background: var(--bg-main);
          border-left: 3px solid var(--primary);
          padding: 8px 10px;
          border-radius: 4px;
        }

        .pres-label {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--text-muted);
        }

        .pres-text {
          font-size: 0.8rem;
          color: var(--text-main);
          margin-top: 2px;
        }

        .record-notes {
          font-size: 0.78rem;
          color: var(--text-muted);
        }

        .next-due-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.76rem;
          color: var(--primary-dark);
          background: var(--primary-soft);
          padding: 4px 8px;
          border-radius: var(--radius-sm);
          width: fit-content;
        }

        .doc-link-tag {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.74rem;
          color: var(--secondary);
        }
      `}</style>
    </>
  );
};
