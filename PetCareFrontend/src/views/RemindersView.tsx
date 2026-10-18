import React, { useState } from 'react';
import { Pet, Reminder, ReminderType, ReminderPriority, RepeatFrequency } from '../types';
import confetti from 'canvas-confetti';
import { 
  Bell, 
  Plus, 
  Calendar, 
  Clock, 
  Check, 
  Trash2, 
  Syringe, 
  Pill, 
  Scissors, 
  Stethoscope, 
  RotateCw,
  Sparkles
} from 'lucide-react';

interface RemindersViewProps {
  pets: Pet[];
  activePet: Pet | null;
  reminders: Reminder[];
  onToggleReminder: (id: string) => void;
  onDeleteReminder: (id: string) => void;
  onAddReminder: (reminder: Reminder) => void;
  onShowToast: (text: string, type: 'success' | 'warning' | 'info' | 'error') => void;
}

export const RemindersView: React.FC<RemindersViewProps> = ({
  pets,
  activePet,
  reminders,
  onToggleReminder,
  onDeleteReminder,
  onAddReminder,
  onShowToast
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [selectedPetId, setSelectedPetId] = useState<string>(activePet ? activePet.id : (pets[0]?.id || ''));
  const [type, setType] = useState<ReminderType>('vaccine');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('09:00');
  const [repeat, setRepeat] = useState<RepeatFrequency>('monthly');
  const [priority, setPriority] = useState<ReminderPriority>('high');
  const [notes, setNotes] = useState('');

  // Sync selectedPetId when activePet changes
  React.useEffect(() => {
    if (activePet) {
      setSelectedPetId(activePet.id);
    } else if (pets.length > 0) {
      setSelectedPetId(pets[0].id);
    }
  }, [activePet, pets]);

  const handleToggle = (id: string, isDoneCurrently: boolean) => {
    onToggleReminder(id);
    if (!isDoneCurrently) {
      // Fire celebratory confetti!
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.7 }
      });
      onShowToast('Chúc mừng! Bạn đã hoàn thành lịch chăm sóc thú cưng 🐾', 'success');
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !selectedPetId) return;

    const newRem: Reminder = {
      id: 'rem_' + Date.now(),
      petId: selectedPetId,
      type,
      title: title.trim(),
      date,
      time,
      repeat,
      priority,
      notes: notes.trim() || undefined,
      isCompleted: false
    };

    onAddReminder(newRem);
    setIsModalOpen(false);
    setTitle('');
    setNotes('');
    onShowToast('Đã lên lịch nhắc nhở thành công!', 'success');
  };

  // Only display reminders that belong to activePet, or all current user pets if no active pet
  const relevantReminders = activePet 
    ? reminders.filter(r => r.petId === activePet.id)
    : reminders.filter(r => pets.some(p => p.id === r.petId));

  const pendingReminders = relevantReminders.filter(r => !r.isCompleted);
  const completedReminders = relevantReminders.filter(r => r.isCompleted);

  return (
    <>
      <div className="reminders-container animate-fade-in">
        {/* Header */}
      <div className="reminders-header card">
        <div className="rem-head-left">
          <div className="rem-icon-circle">
            <Bell size={24} />
          </div>
          <div>
            <h2 className="rem-title">Hệ Thống Nhắc Lịch Thực Tế</h2>
            <p className="rem-sub">Báo giờ tiêm vaccine, uống thuốc và tẩy giun định kỳ</p>
          </div>
        </div>

        <button className="btn-primary btn-sm" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} />
          <span>Tạo lịch</span>
        </button>
      </div>

      {/* Pending Reminders */}
      <div className="rem-section">
        <h3 className="section-title">Sắp đến hạn ({pendingReminders.length})</h3>
        {pendingReminders.length > 0 ? (
          <div className="rem-list">
            {pendingReminders.map(r => {
              const pet = pets.find(p => p.id === r.petId);
              return (
                <div key={r.id} className="rem-item card">
                  <button 
                    className="check-circle-btn"
                    onClick={() => handleToggle(r.id, r.isCompleted)}
                    title="Đánh dấu hoàn thành"
                  >
                    <div className="circle-inner" />
                  </button>

                  <div className="rem-item-info">
                    <div className="rem-title-row">
                      <h4 className="r-title">{r.title}</h4>
                      <span className={`badge ${r.priority === 'high' ? 'badge-emergency' : 'badge-warning'}`}>
                        {r.priority === 'high' ? 'Ưu tiên' : 'Thường'}
                      </span>
                    </div>

                    <div className="rem-meta-row">
                      <span>🐾 {pet ? pet.name : 'Thú cưng'}</span>
                      <span>📅 {r.date} lúc {r.time}</span>
                      {r.repeat !== 'none' && (
                        <span className="repeat-badge">
                          <RotateCw size={11} />
                          {r.repeat === 'daily' ? 'Hàng ngày' : r.repeat === 'weekly' ? 'Hàng tuần' : r.repeat === 'monthly' ? 'Hàng tháng' : 'Hàng năm'}
                        </span>
                      )}
                    </div>

                    {r.notes && <p className="rem-notes-text">📝 {r.notes}</p>}
                  </div>

                  <button className="del-btn" onClick={() => onDeleteReminder(r.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="card empty-box">
            <Sparkles size={28} className="empty-sparkle" />
            <p>Tuyệt vời! Không còn lịch hẹn nào chưa hoàn thành.</p>
          </div>
        )}
      </div>

      {/* Completed Reminders */}
      {completedReminders.length > 0 && (
        <div className="rem-section">
          <h3 className="section-title text-muted">Đã hoàn thành ({completedReminders.length})</h3>
          <div className="rem-list">
            {completedReminders.map(r => (
              <div key={r.id} className="rem-item card done">
                <button 
                  className="check-circle-btn done"
                  onClick={() => handleToggle(r.id, r.isCompleted)}
                  title="Bỏ đánh dấu hoàn thành"
                >
                  <Check size={14} />
                </button>

                <div className="rem-item-info">
                  <h4 className="r-title strikethrough">{r.title}</h4>
                  <span className="rem-meta-row text-muted">Đã thực hiện vào {r.date}</span>
                </div>

                <button className="del-btn" onClick={() => onDeleteReminder(r.id)}>
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal-sheet animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Tạo Nhắc Lịch Mới</h3>
              <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleCreate} className="modal-form-wrapper">
              <div className="modal-body">
                <div className="input-group">
                  <label className="input-label">Dành cho thú cưng *</label>
                  <select 
                    className="select-field"
                    value={selectedPetId}
                    onChange={e => setSelectedPetId(e.target.value)}
                    required
                  >
                    {pets.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.species === 'dog' ? '🐶' : '🐱'} {p.name} ({p.breed})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="input-group">
                  <label className="input-label">Loại sự kiện *</label>
                  <select 
                    className="select-field"
                    value={type}
                    onChange={e => setType(e.target.value as ReminderType)}
                  >
                    <option value="vaccine">💉 Tiêm phòng Vaccine</option>
                    <option value="deworming">🐛 Tẩy giun định kỳ</option>
                    <option value="medication">💊 Uống thuốc</option>
                    <option value="checkup">🩺 Tái khám / Khám sức khỏe</option>
                    <option value="grooming">✂️ Tắm & Grooming</option>
                    <option value="feeding">🍖 Chế độ ăn đặc biệt</option>
                    <option value="other">🔔 Khác</option>
                  </select>
                </div>

                <div className="input-group">
                  <label className="input-label">Tiêu đề nhắc nhở *</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="VD: Tẩy giun quý 4, Tiêm nhắc vaccine dại..."
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="grid-2">
                  <div className="input-group">
                    <label className="input-label">Ngày thực hiện *</label>
                    <input 
                      type="date" 
                      className="input-field"
                      value={date}
                      onChange={e => setDate(e.target.value)}
                      required
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Giờ nhắc *</label>
                    <input 
                      type="time" 
                      className="input-field"
                      value={time}
                      onChange={e => setTime(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid-2">
                  <div className="input-group">
                    <label className="input-label">Chu kỳ lặp lại</label>
                    <select 
                      className="select-field"
                      value={repeat}
                      onChange={e => setRepeat(e.target.value as RepeatFrequency)}
                    >
                      <option value="none">Không lặp</option>
                      <option value="daily">Hàng ngày</option>
                      <option value="weekly">Hàng tuần</option>
                      <option value="monthly">Hàng tháng</option>
                      <option value="yearly">Hàng năm</option>
                    </select>
                  </div>

                  <div className="input-group">
                    <label className="input-label">Mức độ ưu tiên</label>
                    <select 
                      className="select-field"
                      value={priority}
                      onChange={e => setPriority(e.target.value as ReminderPriority)}
                    >
                      <option value="high">🚨 Ưu tiên cao</option>
                      <option value="medium">⚡ Trung bình</option>
                      <option value="low">🌱 Nhắc nhẹ</option>
                    </select>
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label">Ghi chú thêm</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="VD: Cho uống sau ăn sáng 30 phút..."
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-outline" onClick={() => setIsModalOpen(false)}>Hủy</button>
                <button type="submit" className="btn-primary">Lưu lịch hẹn</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .reminders-container {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .reminders-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 16px;
          background: var(--primary-gradient-subtle);
          border: 1px solid var(--primary-light);
        }

        .rem-head-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .rem-icon-circle {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-md);
          background: var(--primary);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .rem-title {
          font-size: 1.05rem;
        }

        .rem-sub {
          font-size: 0.74rem;
          color: var(--text-muted);
        }

        .rem-section {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .rem-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .rem-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px;
        }

        .rem-item.done {
          opacity: 0.65;
          background: var(--bg-main);
        }

        .check-circle-btn {
          width: 28px;
          height: 28px;
          border-radius: var(--radius-full);
          border: 2px solid var(--border-color);
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          flex-shrink: 0;
        }

        .circle-inner {
          width: 14px;
          height: 14px;
          border-radius: var(--radius-full);
          background: transparent;
          transition: background 0.15s;
        }

        .check-circle-btn:hover .circle-inner {
          background: var(--primary-light);
        }

        .check-circle-btn.done {
          background: var(--success);
          border-color: var(--success);
          color: #ffffff;
        }

        .rem-item-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .rem-title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .r-title {
          font-size: 0.95rem;
          color: var(--text-main);
        }

        .r-title.strikethrough {
          text-decoration: line-through;
        }

        .rem-meta-row {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.75rem;
          color: var(--text-muted);
          flex-wrap: wrap;
        }

        .repeat-badge {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          background: var(--primary-soft);
          color: var(--primary);
          padding: 2px 6px;
          border-radius: var(--radius-full);
          font-weight: 600;
        }

        .rem-notes-text {
          font-size: 0.76rem;
          color: var(--text-muted);
        }

        .del-btn {
          width: 32px;
          height: 32px;
          padding: 0;
          color: var(--text-muted);
          border-radius: var(--radius-full);
        }

        .del-btn:hover {
          color: var(--emergency);
        }

        .empty-box {
          padding: 24px;
          text-align: center;
          color: var(--text-muted);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }

        .empty-sparkle {
          color: var(--warning);
        }
      `}</style>
    </>
  );
};
