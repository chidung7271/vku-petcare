import React, { useState, useEffect } from 'react';
import { EmergencyCase } from '../types';
import { EMERGENCY_CASES, searchEmergencyCases } from '../services/emergencyData';
import { 
  PhoneCall, 
  MapPin, 
  Share2, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Search, 
  ShieldAlert, 
  HeartCrack, 
  BookOpen, 
  Check, 
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface EmergencyViewProps {
  initialQuery?: string;
  onNavigateToLocations: () => void;
  onShowToast: (text: string, type: 'success' | 'warning' | 'info' | 'error') => void;
}

export const EmergencyView: React.FC<EmergencyViewProps> = ({
  initialQuery = '',
  onNavigateToLocations,
  onShowToast
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [selectedCase, setSelectedCase] = useState<EmergencyCase>(
    EMERGENCY_CASES[0] // Default to Poisoning as top risk
  );

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      const results = searchEmergencyCases(initialQuery);
      if (results.length > 0) {
        setSelectedCase(results[0]);
      }
    }
  }, [initialQuery]);

  const searchResults = searchEmergencyCases(query);

  // Auto-select the first matching case when typing query
  useEffect(() => {
    if (query.trim() && searchResults.length > 0) {
      setSelectedCase(searchResults[0]);
    }
  }, [query]);

  const handleSelectCase = (c: EmergencyCase) => {
    setSelectedCase(c);
  };

  const handleShareLocation = async () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const text = `SOS Thú Cưng Cần Cấp Cứu! Vị trí hiện tại: https://maps.google.com/?q=${pos.coords.latitude},${pos.coords.longitude}`;
          if (navigator.share) {
            navigator.share({ title: 'SOS Cấp Cứu Thú Cưng', text }).catch(() => {});
          } else {
            navigator.clipboard.writeText(text);
            onShowToast('Đã sao chép tọa độ vị trí cấp cứu vào khay nhớ tạm!', 'success');
          }
        },
        () => {
          onShowToast('Vui lòng bật quyền vị trí hoặc chia sẻ địa chỉ cụ thể cho cơ sở thú y.', 'warning');
        }
      );
    } else {
      onShowToast('Thiết bị không hỗ trợ định vị tự động.', 'warning');
    }
  };

  return (
    <div className="emergency-screen animate-fade-in">
      {/* 1. Urgent Top Alert Bar */}
      <div className="sos-banner">
        <div className="sos-banner-left">
          <div className="sos-pulse-circle">
            <AlertTriangle size={26} />
          </div>
          <div>
            <h2 className="sos-title">TRỢ LÝ CẤP CỨU THÚ Y SOS</h2>
            <span className="sos-sub">Bình tĩnh • Hành động theo checklist • Ưu tiên liên hệ bác sĩ</span>
          </div>
        </div>

        {/* 1-Tap Emergency Call */}
        <a href="tel:1900115" className="btn-sos-call">
          <PhoneCall size={18} />
          <span>GỌI 115 THÚ Y</span>
        </a>
      </div>

      {/* 2. Instant Search Box */}
      <div className="emergency-search-card card">
        <div className="search-box emergency-border">
          <Search size={20} className="red-search-icon" />
          <input 
            type="text" 
            placeholder="Gõ nhanh triệu chứng: nuốt bả, sô cô la, hóc xương, chảy máu..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          {query && (
            <button className="clear-btn" onClick={() => setQuery('')}>✕</button>
          )}
        </div>

        {/* Common Scenarios Chips / Search Results */}
        <div className="quick-cases-chips">
          {searchResults.length > 0 ? (
            searchResults.map(c => (
              <button
                key={c.id}
                className={`case-chip ${selectedCase.id === c.id ? 'active' : ''}`}
                onClick={() => handleSelectCase(c)}
              >
                {c.urgencyLevel === 'CRITICAL' && '🚨 '}
                {c.title}
              </button>
            ))
          ) : (
            <div className="no-search-results">
              <span>Không tìm thấy cẩm nang phù hợp cho "{query}". Hãy liên hệ ngay hotline 115 thú y!</span>
            </div>
          )}
        </div>
        {query.trim() && searchResults.length > 0 && (
          <div className="search-match-badge">
            <Sparkles size={13} />
            <span>Tìm thấy {searchResults.length} trường hợp khẩn cấp liên quan</span>
          </div>
        )}
      </div>

      {/* 3. Triage Action Panel (Action-First Layout) */}
      <div className="triage-panel card">
        {/* Urgency Level Header */}
        <div className={`urgency-header-bar ${selectedCase.urgencyLevel.toLowerCase()}`}>
          <div className="urgency-title-row">
            <span className="urgency-tag">MỨC ĐỘ NGUY CẤP:</span>
            <span className="urgency-level-text">{selectedCase.badgeLabel}</span>
          </div>
          <h3 className="case-title">{selectedCase.title}</h3>
          <p className="case-summary">{selectedCase.summary}</p>
        </div>

        {/* SECTION A: LÀM NGAY (Do Immediately Checklist) */}
        <div className="action-section do-box">
          <div className="section-badge-header green">
            <CheckCircle2 size={18} />
            <h4>1. VIỆC CẦN LÀM NGAY (CHECKLIST)</h4>
          </div>
          <ul className="checklist">
            {selectedCase.doImmediately.map((action, i) => (
              <li key={i} className="checklist-item">
                <span className="step-num">{i + 1}</span>
                <span className="step-text">{action}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* SECTION B: TUYỆT ĐỐI KHÔNG NÊN LÀM (Strict Veterinary Safety) */}
        <div className="action-section dont-box">
          <div className="section-badge-header red">
            <XCircle size={18} />
            <h4>2. TUYỆT ĐỐI KHÔNG NÊN LÀM</h4>
          </div>
          <ul className="checklist warning">
            {selectedCase.doNotDo.map((item, i) => (
              <li key={i} className="checklist-item warning">
                <span className="warn-cross">✕</span>
                <span className="step-text">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* SECTION C: DẤU HIỆU NGUY HIỂM (Danger Signs) */}
        <div className="action-section danger-box">
          <div className="section-badge-header orange">
            <ShieldAlert size={18} />
            <h4>3. DẤU HIỆU BÁO ĐỘNG ĐỎ NGUY KỊCH</h4>
          </div>
          <div className="danger-grid">
            {selectedCase.dangerSigns.map((sign, i) => (
              <div key={i} className="danger-sign-card">
                <span className="danger-dot" />
                <span>{sign}</span>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION D: HÀNH ĐỘNG TIẾP THEO (Action Buttons) */}
        <div className="next-actions-block">
          <h4>4. HÀNH ĐỘNG TIẾP THEO</h4>
          <div className="actions-grid">
            <a href="tel:1900115" className="action-button call">
              <PhoneCall size={20} />
              <div className="act-text">
                <strong>Gọi Bác Sĩ Thú Y</strong>
                <span>Tư vấn xử trí trực tiếp</span>
              </div>
            </a>

            <button className="action-button vet" onClick={onNavigateToLocations}>
              <MapPin size={20} />
              <div className="act-text">
                <strong>Tìm Viện Thú Y Gần Nhất</strong>
                <span>Cơ sở cấp cứu 24/7 có máy móc</span>
              </div>
            </button>

            <button className="action-button share" onClick={handleShareLocation}>
              <Share2 size={20} />
              <div className="act-text">
                <strong>Chia Sẻ Tọa Độ GPS</strong>
                <span>Gửi vị trí cho xe cấp cứu</span>
              </div>
            </button>
          </div>
        </div>

        {/* STRICT MEDICAL SAFETY DISCLAIMER */}
        <div className="vet-safety-notice">
          <ShieldAlert size={20} className="notice-icon" />
          <p>
            <strong>QUY TẮC AN TOÀN Y KHOA:</strong> Các chỉ dẫn trên nhằm mục đích sơ cứu bảo toàn tính mạng trong thời gian vàng. 
            PetCare không khuyến khích mẹo dân gian chưa được kiểm chứng, không tự ý gây nôn sai cách và không đưa liều thuốc nếu chưa có chỉ định trực tiếp từ bác sĩ thú y.
          </p>
        </div>
      </div>

      <style>{`
        .emergency-screen {
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          background: #fff5f5;
          min-height: 100%;
        }

        [data-theme="dark"] .emergency-screen {
          background: #180808;
        }

        .sos-banner {
          background: var(--emergency-gradient);
          color: #ffffff;
          padding: 16px;
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: var(--shadow-emergency);
          gap: 12px;
        }

        .sos-banner-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .sos-pulse-circle {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-full);
          background: rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          animation: pulse-emergency 1.8s infinite;
        }

        .sos-title {
          font-size: 1.05rem;
          font-weight: 800;
          color: #ffffff;
          line-height: 1.2;
        }

        .sos-sub {
          font-size: 0.72rem;
          color: rgba(255, 255, 255, 0.9);
        }

        .btn-sos-call {
          background: #ffffff;
          color: var(--emergency);
          padding: 8px 14px;
          border-radius: var(--radius-md);
          font-size: 0.8rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 6px;
          text-decoration: none;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
          white-space: nowrap;
          flex-shrink: 0;
        }

        /* Search Card */
        .emergency-search-card {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 12px;
          border-color: rgba(220, 38, 38, 0.3);
        }

        .emergency-border {
          border-color: rgba(220, 38, 38, 0.4);
        }

        .red-search-icon {
          color: var(--emergency);
          flex-shrink: 0;
        }

        .clear-btn {
          min-height: 24px;
          padding: 0 8px;
          color: var(--text-muted);
        }

        .quick-cases-chips {
          display: flex;
          gap: 6px;
          overflow-x: auto;
          padding-bottom: 2px;
        }

        .case-chip {
          min-height: 32px;
          padding: 4px 10px;
          border-radius: var(--radius-full);
          border: 1px solid var(--border-color);
          background: var(--bg-main);
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-main);
          white-space: nowrap;
        }

        .case-chip.active {
          background: var(--emergency);
          color: #ffffff;
          border-color: var(--emergency);
        }

        .search-match-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.75rem;
          color: var(--emergency);
          font-weight: 700;
          padding: 2px 4px;
        }

        .no-search-results {
          padding: 8px 10px;
          font-size: 0.8rem;
          color: var(--emergency);
          font-weight: 600;
          background: var(--emergency-soft);
          border-radius: var(--radius-sm);
          width: 100%;
        }

        /* Triage Panel */
        .triage-panel {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 16px;
          border: 1.5px solid rgba(220, 38, 38, 0.4);
        }

        .urgency-header-bar {
          padding: 14px;
          border-radius: var(--radius-md);
          background: var(--emergency-soft);
          border-left: 5px solid var(--emergency);
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .urgency-title-row {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .urgency-tag {
          font-size: 0.7rem;
          font-weight: 800;
          color: var(--emergency);
        }

        .urgency-level-text {
          font-size: 0.8rem;
          font-weight: 800;
          color: var(--emergency);
        }

        .case-title {
          font-size: 1.25rem;
          margin-top: 2px;
        }

        .case-summary {
          font-size: 0.85rem;
          color: var(--text-main);
          line-height: 1.4;
        }

        /* Action Sections */
        .action-section {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 12px;
          border-radius: var(--radius-md);
        }

        .action-section.do-box {
          background: var(--success-soft);
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .action-section.dont-box {
          background: var(--emergency-soft);
          border: 1px solid rgba(220, 38, 38, 0.3);
        }

        .action-section.danger-box {
          background: var(--warning-soft);
          border: 1px solid rgba(245, 158, 11, 0.3);
        }

        .section-badge-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 800;
        }

        .section-badge-header.green { color: #047857; }
        .section-badge-header.red { color: var(--emergency); }
        .section-badge-header.orange { color: #b45309; }

        .section-badge-header h4 {
          font-size: 0.88rem;
          letter-spacing: 0.02em;
        }

        .checklist {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .checklist-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 0.85rem;
          line-height: 1.45;
          color: var(--text-main);
        }

        .step-num {
          width: 20px;
          height: 20px;
          border-radius: var(--radius-full);
          background: #047857;
          color: #ffffff;
          font-size: 0.72rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .warn-cross {
          width: 20px;
          height: 20px;
          border-radius: var(--radius-full);
          background: var(--emergency);
          color: #ffffff;
          font-size: 0.72rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .danger-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 6px;
        }

        .danger-sign-card {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.82rem;
          color: #78350f;
          font-weight: 600;
        }

        [data-theme="dark"] .danger-sign-card {
          color: #fef3c7;
        }

        .danger-dot {
          width: 8px;
          height: 8px;
          border-radius: var(--radius-full);
          background: #f59e0b;
          flex-shrink: 0;
        }

        /* Next Actions */
        .next-actions-block {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .next-actions-block h4 {
          font-size: 0.9rem;
        }

        .actions-grid {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .action-button {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 12px 14px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
          background: var(--bg-card);
          text-decoration: none;
          color: var(--text-main);
          min-height: 54px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .action-button:hover {
          border-color: var(--primary);
        }

        .action-button.call {
          background: var(--emergency-soft);
          border-color: var(--emergency);
          color: var(--emergency);
        }

        .act-text {
          display: flex;
          flex-direction: column;
          text-align: left;
        }

        .act-text strong {
          font-size: 0.9rem;
        }

        .act-text span {
          font-size: 0.74rem;
          color: var(--text-muted);
        }

        .action-button.call .act-text span {
          color: var(--emergency);
          opacity: 0.8;
        }

        /* Safety Notice */
        .vet-safety-notice {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 12px;
          border-radius: var(--radius-md);
          background: var(--secondary-soft);
          font-size: 0.75rem;
          line-height: 1.45;
          color: var(--text-muted);
        }

        .notice-icon {
          color: var(--secondary);
          flex-shrink: 0;
          margin-top: 2px;
        }
      `}</style>
    </div>
  );
};
