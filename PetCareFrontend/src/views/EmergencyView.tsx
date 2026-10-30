import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { EmergencyCase } from '../types';
import { EMERGENCY_CASES, searchEmergencyCases } from '../services/emergencyData';
import { aiEmergencyService, AIEmergencyResponse } from '../services/aiEmergencyService';
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
  Sparkles,
  Bot,
  Loader2,
  FileText
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
  const [currentAiTarget, setCurrentAiTarget] = useState('');
  const [aiGuidance, setAiGuidance] = useState<AIEmergencyResponse | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [isViewingAI, setIsViewingAI] = useState(false);
  const [showAIReaderModal, setShowAIReaderModal] = useState(false);
  const [selectedCase, setSelectedCase] = useState<EmergencyCase>(
    EMERGENCY_CASES[0] // Default to Poisoning as top risk
  );

  const searchResults = searchEmergencyCases(query);

  const handleOpenAIReader = async (targetTitle?: string) => {
    const target = (targetTitle || query || selectedCase.title).trim();
    if (!target) return;

    setCurrentAiTarget(target);
    setShowAIReaderModal(true);

    // Only call Backend AI API if not already fetched for this target
    if (!aiGuidance || aiGuidance.title.toLowerCase() !== target.toLowerCase()) {
      setIsLoadingAI(true);
      try {
        const res = await aiEmergencyService.getGuidance(target);
        setAiGuidance(res);
        setIsViewingAI(true);
      } catch {
        const fallback = aiEmergencyService.getFallbackGuidance(target);
        setAiGuidance(fallback);
        setIsViewingAI(true);
      } finally {
        setIsLoadingAI(false);
      }
    }
  };

  const handleRefreshAI = async (targetTitle?: string) => {
    const target = (targetTitle || currentAiTarget || query || selectedCase.title).trim();
    if (!target) return;

    setIsLoadingAI(true);
    try {
      const res = await aiEmergencyService.getGuidance(target);
      setAiGuidance(res);
      setIsViewingAI(true);
    } catch {
      const fallback = aiEmergencyService.getFallbackGuidance(target);
      setAiGuidance(fallback);
      setIsViewingAI(true);
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handleQueryChange = (val: string) => {
    setQuery(val);
    // User is actively typing: reset AI view state so we don't show stale AI data
    if (isViewingAI) {
      setIsViewingAI(false);
      setAiGuidance(null);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      const results = searchEmergencyCases(initialQuery);
      if (results.length > 0) {
        setSelectedCase(results[0]);
      }
    }
  }, [initialQuery]);

  // Update selected case only when offline search matches, NO API call while typing!
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed && searchResults.length > 0 && !isViewingAI) {
      setSelectedCase(searchResults[0]);
    }
  }, [query, searchResults.length, isViewingAI]);

  const handleSelectCase = (c: EmergencyCase) => {
    setSelectedCase(c);
    setIsViewingAI(false);
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
            onChange={e => handleQueryChange(e.target.value)}
          />
          {query && (
            <button className="clear-btn" onClick={() => handleQueryChange('')}>✕</button>
          )}
        </div>

        {/* Common Scenarios Chips / Search Results */}
        <div className="quick-cases-chips">
          {searchResults.length > 0 ? (
            <>
              {searchResults.map(c => (
                <button
                  key={c.id}
                  className={`case-chip ${(!isViewingAI && selectedCase.id === c.id) ? 'active' : ''}`}
                  onClick={() => handleSelectCase(c)}
                >
                  {c.urgencyLevel === 'CRITICAL' && '🚨 '}
                  {c.title}
                </button>
              ))}
              {query.trim() && (
                <button
                  type="button"
                  className={`case-chip ai-quick-chip ${isViewingAI ? 'active' : ''}`}
                  onClick={() => handleOpenAIReader(query)}
                >
                  <Sparkles size={13} />
                  ✨ Hỏi AI: "{query}"
                </button>
              )}
            </>
          ) : (
            query.trim() ? (
              <div className="ai-chip-indicator">
                <Sparkles size={14} />
                <span>Chưa có cẩm nang sẵn cho "{query}" — Sẵn sàng hỗ trợ bởi AI Khẩn Cấp</span>
              </div>
            ) : null
          )}
        </div>
        {query.trim() && searchResults.length > 0 && (
          <div className="search-match-bar">
            <div className="search-match-badge">
              <Sparkles size={13} />
              <span>Tìm thấy {searchResults.length} trường hợp khẩn cấp liên quan</span>
            </div>
            <button 
              type="button" 
              className="btn-search-ai-alt"
              onClick={() => handleOpenAIReader(query)}
            >
              <Sparkles size={12} />
              <span>Cần AI phân tích riêng cho "{query}"? Bấm vào đây</span>
            </button>
          </div>
        )}
      </div>

      {/* 3. Triage Action Panel: Standard Offline Case OR AI Emergency Triage */}
      {!isViewingAI && searchResults.length > 0 ? (
        <div className="triage-panel card">
          {/* Urgency Level Header */}
          <div className={`urgency-header-bar ${selectedCase.urgencyLevel.toLowerCase()}`}>
            <div className="urgency-title-row">
              <span className="urgency-tag">MỨC ĐỘ NGUY CẤP:</span>
              <span className="urgency-level-text">{selectedCase.badgeLabel}</span>
            </div>
            <h3 className="case-title">{selectedCase.title}</h3>
            <p className="case-summary">{selectedCase.summary}</p>
            <div className="case-ai-cta-row">
              <button 
                type="button"
                className="btn-ai-read-banner"
                onClick={() => handleOpenAIReader(query || selectedCase.title)}
              >
                <Sparkles size={15} />
                <span>Đọc thông tin xử lý do AI sinh ra</span>
              </button>
            </div>
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
      ) : (isViewingAI && aiGuidance) ? (
        /* 4. AI Emergency Triage Panel (Generated by Gemini AI Backend) */
        <div className="triage-panel card ai-panel">
          <div className="ai-header-bar">
            <div className="ai-badge-row">
              <span className="ai-tag">
                <Sparkles size={15} /> 
                TRỢ LÝ AI CẤP CỨU (GEMINI AI)
              </span>
              <span className="ai-status-pill">
                {isLoadingAI ? 'ĐANG TỔNG HỢP PHÁC ĐỒ...' : (aiGuidance?.severityBadge || 'PHÁC ĐỒ TỨC THÌ')}
              </span>
            </div>
            <h3 className="case-title">{aiGuidance?.title || `Phân tích tình huống: "${query}"`}</h3>
            <div className="case-summary">
              {isLoadingAI ? (
                <div className="ai-loading-box">
                  <Loader2 size={18} className="spin-icon" />
                  <span>Trợ lý Gemini AI đang phân tích dữ liệu lâm sàng và sinh phác đồ xử lý riêng cho: <strong>"{query}"</strong>...</span>
                </div>
              ) : (
                <p>{aiGuidance?.summary || `Trợ lý AI đã ghi nhận trường hợp "${query}" và phân tích hướng xử lý dưới đây:`}</p>
              )}
            </div>

            <div className="ai-action-buttons-row">
              <button 
                type="button"
                className="btn-ai-read"
                onClick={() => handleOpenAIReader(aiGuidance.title)}
                disabled={isLoadingAI}
              >
                <BookOpen size={16} />
                Đọc thông tin xử lý do AI sinh ra (In-App)
              </button>
              <button 
                type="button"
                className="btn-ai-refresh"
                onClick={() => handleRefreshAI(aiGuidance.title)}
                disabled={isLoadingAI}
              >
                <Sparkles size={16} />
                {isLoadingAI ? 'Đang phân tích...' : 'Yêu cầu AI phân tích lại'}
              </button>
            </div>
          </div>

          {/* Section 1: VIỆC CẦN LÀM NGAY (AI PHÂN TÍCH THEO TÌNH HUỐNG) */}
          <div className="action-section do-box">
            <div className="section-badge-header green">
              <CheckCircle2 size={18} />
              <h4>1. VIỆC CẦN LÀM NGAY (AI KHUYẾN NGHỊ)</h4>
            </div>
            <ul className="checklist">
              {aiGuidance?.immediateActions && aiGuidance.immediateActions.length > 0 ? (
                aiGuidance.immediateActions.map((action, i) => (
                  <li key={i} className="checklist-item">
                    <span className="step-num">{i + 1}</span>
                    <span className="step-text">{action}</span>
                  </li>
                ))
              ) : (
                <li className="checklist-item">
                  <span className="step-num">1</span>
                  <span className="step-text">Giữ thú cưng ở nơi an toàn, yên tĩnh, kiểm tra đường thở và chuẩn bị đưa đến cơ sở thú y gần nhất.</span>
                </li>
              )}
            </ul>
          </div>

          {/* Section 2: TUYỆT ĐỐI CẤM KỴ KHI CHƯA CÓ CHỈ ĐỊNH BÁC SĨ */}
          <div className="action-section dont-box">
            <div className="section-badge-header red">
              <XCircle size={18} />
              <h4>2. TUYỆT ĐỐI KHÔNG NÊN LÀM (AI CẢNH BÁO AN TOÀN)</h4>
            </div>
            <ul className="checklist warning">
              {aiGuidance?.doNotDo && aiGuidance.doNotDo.length > 0 ? (
                aiGuidance.doNotDo.map((item, i) => (
                  <li key={i} className="checklist-item warning">
                    <span className="warn-cross">✕</span>
                    <span className="step-text">{item}</span>
                  </li>
                ))
              ) : (
                <li className="checklist-item warning">
                  <span className="warn-cross">✕</span>
                  <span className="step-text">TUYỆT ĐỐI KHÔNG tự ý cho uống thuốc giảm đau của người (Paracetamol, Panadol, Aspirin) vì gây ngộ độc suy gan thận tử vong.</span>
                </li>
              )}
            </ul>
          </div>

          {/* Section 3: DẤU HIỆU BÁO ĐỘNG ĐỎ NGUY KỊCH */}
          <div className="action-section danger-box">
            <div className="section-badge-header orange">
              <ShieldAlert size={18} />
              <h4>3. DẤU HIỆU BÁO ĐỘNG ĐỎ NGUY KỊCH</h4>
            </div>
            <div className="danger-grid">
              {(aiGuidance?.warningSigns || [
                'Nướu răng tím tái hoặc trắng bệch',
                'Co giật hoặc bất tỉnh mất ý thức',
                'Khó thở, thở há mõm, sùi bọt mép'
              ]).map((sign, i) => (
                <div key={i} className="danger-sign-card">
                  <span className="danger-dot" />
                  <span>{sign}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: HỖ TRỢ Y TẾ KHẨN CẤP */}
          <div className="next-actions-block">
            <h4>4. HỖ TRỢ Y TẾ KHẨN CẤP</h4>
            <div className="actions-grid">
              <a href="tel:1900115" className="action-button call">
                <PhoneCall size={20} />
                <div className="act-text">
                  <strong>Gọi Cấp Cứu 115 Thú Y</strong>
                  <span>Tư vấn trực tiếp 24/7</span>
                </div>
              </a>

              <button className="action-button vet" onClick={onNavigateToLocations}>
                <MapPin size={20} />
                <div className="act-text">
                  <strong>Bệnh Viện Thú Y 24/7</strong>
                  <span>Chỉ đường cơ sở gần nhất</span>
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

          {/* AI Medical safety notice */}
          <div className="vet-safety-notice">
            <Bot size={20} className="notice-icon" />
            <p>
              <strong>TRỢ LÝ AI CẤP CỨU THÚ Y:</strong> Phác đồ được tổng hợp bởi Google Gemini AI kết hợp cơ sở dữ liệu y tế thú y. Thông tin nhằm hỗ trợ sơ cứu trong thời gian vàng và không thay thế thăm khám trực tiếp của bác sĩ.
            </p>
          </div>
        </div>
      ) : (
        /* 4b. AI Prompt Panel (Before User Clicks to Generate) */
        <div className="triage-panel card ai-panel">
          <div className="ai-header-bar">
            <div className="ai-badge-row">
              <span className="ai-tag">
                <Sparkles size={15} /> 
                TRỢ LÝ AI CẤP CỨU (GEMINI AI)
              </span>
              <span className="ai-status-pill">SẴN SÀNG PHÂN TÍCH</span>
            </div>
            <h3 className="case-title">Tình huống: "{query || 'Cần cấp cứu thú cưng'}"</h3>
            <div className="case-summary">
              <p>
                Trường hợp này chưa có trong cẩm nang có sẵn. Nhấn nút bên dưới để <strong>Trợ lý AI Cấp Cứu (Gemini AI)</strong> phân tích dữ liệu lâm sàng và sinh ngay phác đồ xử lý riêng biệt.
              </p>
            </div>

            <div className="ai-action-buttons-row">
              <button 
                type="button"
                className="btn-ai-read-lg"
                onClick={() => handleOpenAIReader(query)}
                disabled={isLoadingAI}
              >
                <Sparkles size={18} />
                <span>Đọc thông tin xử lý do AI sinh ra</span>
              </button>
            </div>
          </div>

          {/* Quick Hotline Actions */}
          <div className="next-actions-block">
            <h4>HỖ TRỢ Y TẾ KHẨN CẤP (NẾU ĐANG NGUY KỊCH)</h4>
            <div className="actions-grid">
              <a href="tel:1900115" className="action-button call">
                <PhoneCall size={20} />
                <div className="act-text">
                  <strong>Gọi Cấp Cứu 115 Thú Y</strong>
                  <span>Tư vấn trực tiếp 24/7</span>
                </div>
              </a>

              <button className="action-button vet" onClick={onNavigateToLocations}>
                <MapPin size={20} />
                <div className="act-text">
                  <strong>Bệnh Viện Thú Y 24/7</strong>
                  <span>Chỉ đường cơ sở gần nhất</span>
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

          <div className="vet-safety-notice">
            <Bot size={20} className="notice-icon" />
            <p>
              <strong>TRỢ LÝ AI CẤP CỨU THÚ Y:</strong> Phác đồ được tổng hợp bởi Google Gemini AI kết hợp cơ sở dữ liệu y tế thú y. Bấm nút đọc thông tin để bắt đầu phân tích.
            </p>
          </div>
        </div>
      )}

      {/* 5. AI Emergency In-App Article Reader Modal */}
      {showAIReaderModal && createPortal(
        <div className="ai-reader-overlay" onClick={() => setShowAIReaderModal(false)}>
          <div className="ai-reader-modal" onClick={e => e.stopPropagation()}>
            <div className="reader-modal-header">
              <div className="reader-header-left">
                <div className="reader-bot-icon-wrap">
                  <Bot size={22} />
                </div>
                <div>
                  <h3 className="reader-title">Phác đồ sơ cứu: {currentAiTarget || query || selectedCase.title}</h3>
                  <span className="reader-source">{aiGuidance?.source || 'Trợ lý AI Cấp cứu (Google Gemini AI) • Backend API'}</span>
                </div>
              </div>
              <button 
                type="button" 
                className="reader-close-btn" 
                onClick={() => setShowAIReaderModal(false)}
                aria-label="Đóng"
              >
                ✕
              </button>
            </div>

            <div className="reader-modal-body">
              {isLoadingAI ? (
                <div className="reader-loading-state">
                  <div className="reader-loading-spinner-wrap">
                    <Loader2 size={36} className="spin-icon" />
                  </div>
                  <h4 className="reader-loading-title">Trợ lý AI Cấp Cứu đang phân tích...</h4>
                  <p className="reader-loading-desc">
                    Đang gọi Backend Gemini AI để tổng hợp các bước sơ cứu tức thì cho tình huống: <strong>"{currentAiTarget || query || selectedCase.title}"</strong>
                  </p>
                  <div className="reader-loading-warning">
                    <AlertTriangle size={18} className="reader-callout-icon" />
                    <span>Trong lúc chờ đợi, nếu thú cưng có dấu hiệu tím tái, co giật hoặc ngất xỉu, hãy bấm <strong>Gọi 115 Thú Y</strong> ngay bên dưới!</span>
                  </div>
                </div>
              ) : (
                <>
                  <div className="reader-callout-box">
                    <AlertTriangle size={20} className="reader-callout-icon" />
                    <p>
                      Bạn đang đọc thông tin sơ cứu do <strong>Trợ lý AI Cấp cứu (Gemini AI)</strong> sinh ra riêng cho tình huống: <strong>"{currentAiTarget || query || selectedCase.title}"</strong>. 
                      Nếu bé đang trong tình trạng nguy kịch, hãy gọi điện ngay cho bác sĩ thú y trong lúc sơ cứu!
                    </p>
                  </div>

                  <div className="reader-section">
                    <h4>📌 Đánh giá tình huống từ AI:</h4>
                    <p>
                      {aiGuidance?.summary || `Tình huống "${currentAiTarget || query || selectedCase.title}" đòi hỏi sự bình tĩnh và xử lý nhanh chóng theo các bước dưới đây:`}
                    </p>
                  </div>

                  <div className="reader-section">
                    <h4>🩺 Các bước hành động khẩn cấp do AI phân tích:</h4>
                    <div className="reader-steps-container">
                      {(aiGuidance?.immediateActions && aiGuidance.immediateActions.length > 0 
                        ? aiGuidance.immediateActions 
                        : [
                            'Di chuyển thú cưng vào khu vực an toàn, thoáng mát, giữ nằm yên tĩnh.',
                            'Kiểm tra đường thở và màu sắc nướu lợi của thú cưng.',
                            'Sơ cứu cầm máu hoặc giữ ấm/làm mát tùy theo triệu chứng.',
                            'Đưa đến bệnh viện thú y gần nhất càng sớm càng tốt.'
                          ]
                      ).map((action, i) => (
                        <div key={i} className="reader-step-card">
                          <span className="r-step-badge">Bước {i + 1}</span>
                          <div>{action}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="reader-section">
                    <h4>❌ Điều tuyệt đối cấm kỵ (Cảnh báo an toàn):</h4>
                    <ul className="reader-dont-list">
                      {(aiGuidance?.doNotDo && aiGuidance.doNotDo.length > 0 
                        ? aiGuidance.doNotDo 
                        : [
                            'KHÔNG cho uống thuốc giảm đau của người (Paracetamol, Panadol, Aspirin).',
                            'KHÔNG ép ăn hoặc ép uống nước khi thú cưng đang lờ đờ hoặc co giật.',
                            'KHÔNG tự ý áp dụng mẹo dân gian chưa qua kiểm chứng.'
                          ]
                      ).map((dont, i) => (
                        <li key={i}>✕ {dont}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="reader-section">
                    <h4>⚠️ Dấu hiệu báo động đỏ cần đưa đi viện NGAY:</h4>
                    <ul className="reader-danger-list">
                      {(aiGuidance?.warningSigns && aiGuidance.warningSigns.length > 0 
                        ? aiGuidance.warningSigns 
                        : [
                            'Niêm mạc nướu răng tím tái, xám xịt hoặc trắng bệch',
                            'Co giật toàn thân liên tục hoặc ngất xỉu mất ý thức',
                            'Nôn ói ra bọt máu hoặc tiêu chảy tanh khắm mất nước cấp',
                            'Máu chảy thành vòi không cầm được sau 5 phút ép gạc'
                          ]
                      ).map((sign, i) => (
                        <li key={i}>🔴 {sign}</li>
                      ))}
                    </ul>
                  </div>
                </>
              )}

              <div className="reader-actions-footer">
                <a
                  href="tel:1900115"
                  className="btn-primary reader-btn-call"
                >
                  <PhoneCall size={16} />
                  Gọi cấp cứu 115 thú y
                </a>
                <button 
                  type="button" 
                  className="btn-secondary reader-btn-dismiss"
                  onClick={() => setShowAIReaderModal(false)}
                >
                  Đóng bài đọc
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      <style>{`
        .emergency-screen {
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          background: var(--bg-main, #f8fafc);
          min-height: 100%;
        }

        [data-theme="dark"] .emergency-screen {
          background: var(--bg-main, #0f172a);
        }

        /* 1. PetCare Signature Green Theme SOS Banner */
        .sos-banner {
          background: linear-gradient(135deg, #149a8c 0%, #0f766e 100%);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #ffffff;
          padding: 16px;
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 6px 20px rgba(20, 154, 140, 0.22);
          gap: 12px;
        }

        [data-theme="dark"] .sos-banner {
          background: linear-gradient(135deg, #0f766e 0%, #115e59 100%);
          border: 1px solid rgba(45, 212, 191, 0.25);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35);
        }

        .sos-banner-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .sos-pulse-circle {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-full);
          background: rgba(255, 255, 255, 0.2);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .sos-title {
          font-size: 1.05rem;
          font-weight: 800;
          color: #ffffff;
          line-height: 1.2;
          letter-spacing: 0.3px;
        }

        .sos-sub {
          font-size: 0.72rem;
          color: rgba(255, 255, 255, 0.88);
        }

        .btn-sos-call {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: #ffffff !important;
          padding: 9px 15px;
          border-radius: var(--radius-md);
          font-size: 0.82rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 6px;
          text-decoration: none !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          white-space: nowrap;
          flex-shrink: 0;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }

        .btn-sos-call:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
          color: #ffffff !important;
          text-decoration: none !important;
        }

        /* 2. Modern Clean Search Card */
        .emergency-search-card {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 14px;
          border: 1px solid var(--border-color);
          background: var(--bg-card);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-sm);
        }

        .emergency-border {
          border: 1.5px solid var(--border-color);
          background: var(--bg-main);
          border-radius: var(--radius-md);
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .emergency-border:focus-within {
          border-color: var(--primary, #0d9488);
          box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.15);
        }

        .red-search-icon {
          color: var(--primary, #0d9488);
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
          padding: 4px 12px;
          border-radius: var(--radius-full);
          border: 1px solid var(--border-color);
          background: var(--bg-main);
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-main);
          white-space: nowrap;
          cursor: pointer;
          transition: all 0.2s;
        }

        .case-chip:hover {
          border-color: var(--primary, #0d9488);
        }

        .case-chip.active {
          background: var(--primary, #0d9488);
          color: #ffffff;
          border-color: var(--primary, #0d9488);
          box-shadow: 0 2px 6px rgba(13, 148, 136, 0.25);
        }

        .search-match-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.75rem;
          color: var(--text-muted);
          font-weight: 600;
          padding: 2px 4px;
        }

        .ai-quick-chip {
          background: #f5f3ff !important;
          color: #7c3aed !important;
          border-color: #c4b5fd !important;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-weight: 700 !important;
        }

        .ai-quick-chip:hover {
          background: #ede9fe !important;
          border-color: #7c3aed !important;
        }

        .search-match-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 6px;
          width: 100%;
        }

        .btn-search-ai-alt {
          background: none;
          border: none;
          color: #7c3aed;
          font-size: 0.72rem;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          cursor: pointer;
          padding: 2px 4px;
          text-decoration: underline;
        }

        .btn-search-ai-alt:hover {
          color: #5b21b6;
        }

        .no-search-results {
          padding: 8px 10px;
          font-size: 0.8rem;
          color: var(--text-muted);
          font-weight: 600;
          background: var(--bg-main);
          border-radius: var(--radius-sm);
          width: 100%;
        }

        /* 3. Triage Panel */
        .triage-panel {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 16px;
          border: 1px solid var(--border-color);
          background: var(--bg-card);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-sm);
        }

        .urgency-header-bar {
          padding: 14px;
          border-radius: var(--radius-md);
          background: var(--bg-main);
          border: 1px solid var(--border-color);
          border-left: 4px solid var(--primary, #0d9488);
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .urgency-header-bar.critical {
          border-left-color: #f43f5e;
          background: rgba(244, 63, 94, 0.05);
        }

        .urgency-header-bar.high {
          border-left-color: #f59e0b;
          background: rgba(245, 158, 11, 0.05);
        }

        .urgency-header-bar.moderate {
          border-left-color: var(--primary, #0d9488);
          background: rgba(13, 148, 136, 0.05);
        }

        .urgency-title-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .urgency-tag {
          font-size: 0.7rem;
          font-weight: 800;
          color: var(--text-muted);
          letter-spacing: 0.4px;
        }

        .urgency-level-text {
          font-size: 0.75rem;
          font-weight: 800;
          color: #e11d48;
          padding: 2px 8px;
          border-radius: var(--radius-full);
          background: rgba(225, 29, 72, 0.08);
        }

        .case-title {
          font-size: 1.25rem;
          margin-top: 2px;
          font-weight: 800;
          color: var(--text-main);
        }

        .case-summary {
          font-size: 0.85rem;
          color: var(--text-main);
          line-height: 1.45;
        }

        .case-ai-cta-row {
          margin-top: 8px;
        }

        .btn-ai-read-banner {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 15px;
          background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%);
          color: #ffffff;
          border-radius: var(--radius-md);
          font-size: 0.82rem;
          font-weight: 700;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 2px 8px rgba(124, 58, 237, 0.25);
        }

        .btn-ai-read-banner:hover {
          opacity: 0.92;
          transform: translateY(-1px);
        }

        .btn-ai-read-lg {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 20px;
          background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%);
          color: #ffffff;
          border-radius: var(--radius-md);
          font-size: 0.95rem;
          font-weight: 800;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 14px rgba(124, 58, 237, 0.35);
          width: 100%;
        }

        .btn-ai-read-lg:hover:not(:disabled) {
          opacity: 0.95;
          transform: translateY(-1px);
        }

        /* Action Sections */
        .action-section {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 14px;
          border-radius: var(--radius-md);
        }

        .action-section.do-box {
          background: var(--success-soft, #f0fdf4);
          border: 1px solid rgba(16, 185, 129, 0.25);
        }

        .action-section.dont-box {
          background: rgba(244, 63, 94, 0.05);
          border: 1px solid rgba(244, 63, 94, 0.2);
        }

        .action-section.danger-box {
          background: var(--warning-soft, #fffbeb);
          border: 1px solid rgba(245, 158, 11, 0.25);
        }

        .section-badge-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 800;
        }

        .section-badge-header.green { color: #047857; }
        .section-badge-header.red { color: #e11d48; }
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
          background: #e11d48;
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
          font-weight: 700;
          color: var(--text-main);
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
          border-color: var(--primary, #0d9488);
          transform: translateY(-1px);
        }

        .action-button.call {
          background: rgba(225, 29, 72, 0.05);
          border-color: rgba(225, 29, 72, 0.25);
          color: #e11d48;
        }

        .action-button.call:hover {
          background: rgba(225, 29, 72, 0.1);
          border-color: #e11d48;
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
          color: #e11d48;
          opacity: 0.85;
        }

        /* Safety Notice */
        .vet-safety-notice {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 12px;
          border-radius: var(--radius-md);
          background: var(--secondary-soft, #f1f5f9);
          font-size: 0.75rem;
          line-height: 1.45;
          color: var(--text-muted);
        }

        .notice-icon {
          color: var(--secondary, #1e293b);
          flex-shrink: 0;
          margin-top: 2px;
        }

        /* AI Emergency Panel (Gemini AI Backend) */
        .ai-panel {
          border-color: #8b5cf6 !important;
          background: #faf5ff;
        }

        [data-theme="dark"] .ai-panel {
          background: #140d24;
          border-color: #7c3aed !important;
        }

        .ai-header-bar {
          padding: 16px;
          border-radius: var(--radius-md);
          background: linear-gradient(135deg, #f5f3ff 0%, #eef2ff 100%);
          border-left: 5px solid #7c3aed;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        [data-theme="dark"] .ai-header-bar {
          background: rgba(124, 58, 237, 0.15);
        }

        .ai-badge-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .ai-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.75rem;
          font-weight: 800;
          color: #6d28d9;
          letter-spacing: 0.3px;
        }

        .ai-status-pill {
          font-size: 0.68rem;
          font-weight: 800;
          padding: 3px 10px;
          border-radius: var(--radius-full);
          background: #ede9fe;
          color: #5b21b6;
          border: 1px solid #c4b5fd;
        }

        .ai-loading-box {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 12px;
          background: #ffffff;
          border-radius: var(--radius-sm);
          border: 1px dashed #8b5cf6;
          font-size: 0.8rem;
          color: #6d28d9;
          font-weight: 600;
        }

        .spin-icon {
          animation: spin 1s linear infinite;
          color: #7c3aed;
        }

        @keyframes spin {
          100% { transform: rotate(360deg); }
        }

        .sparkle-spin {
          animation: spin 3s linear infinite;
          color: #7c3aed;
        }

        .ai-action-buttons-row {
          display: flex;
          gap: 8px;
          margin-top: 6px;
          flex-wrap: wrap;
        }

        .btn-ai-read {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%);
          color: #ffffff;
          border-radius: var(--radius-md);
          font-size: 0.82rem;
          font-weight: 700;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 2px 8px rgba(124, 58, 237, 0.25);
        }

        .btn-ai-read:hover:not(:disabled) {
          opacity: 0.92;
          transform: translateY(-1px);
        }

        .btn-ai-refresh {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          background: #ffffff;
          color: #6d28d9;
          border-radius: var(--radius-md);
          font-size: 0.82rem;
          font-weight: 700;
          border: 1.5px solid #ddd6fe;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-ai-refresh:hover:not(:disabled) {
          background: #f5f3ff;
          border-color: #8b5cf6;
        }

        .btn-ai-read:disabled, .btn-ai-refresh:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .ai-chip-indicator {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: #f5f3ff;
          color: #6d28d9;
          border: 1px dashed #c4b5fd;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 600;
          width: 100%;
        }

        /* In-App AI Reader Modal */
        .ai-reader-overlay {
          position: fixed !important;
          inset: 0 !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          height: 100dvh !important;
          background: rgba(15, 23, 42, 0.75) !important;
          backdrop-filter: blur(8px) !important;
          -webkit-backdrop-filter: blur(8px) !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          z-index: 99999 !important;
          padding: 16px !important;
          box-sizing: border-box !important;
        }

        .ai-reader-modal {
          background: var(--bg-card);
          border-radius: var(--radius-xl, 20px);
          max-width: 520px;
          width: 100%;
          max-height: 85vh;
          max-height: 85dvh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
          border: 1px solid var(--border-color);
          overflow: hidden;
          animation: modal-pop 0.2s ease-out;
          margin: auto;
        }

        @keyframes modal-pop {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }

        .reader-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px;
          border-bottom: 1px solid var(--border-color);
          background: var(--bg-main);
        }

        .reader-header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .reader-bot-icon-wrap {
          width: 38px;
          height: 38px;
          border-radius: var(--radius-md);
          background: linear-gradient(135deg, #ede9fe 0%, #e0e7ff 100%);
          color: #7c3aed;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .reader-title {
          font-size: 1.05rem;
          font-weight: 800;
          margin-bottom: 2px;
          color: var(--text-main);
        }

        .reader-source {
          font-size: 0.72rem;
          color: var(--text-muted);
        }

        .reader-close-btn {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-full);
          border: none;
          background: var(--border-color);
          color: var(--text-main);
          font-size: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .reader-modal-body {
          padding: 18px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .reader-callout-box {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 12px;
          background: #fffbeb;
          border-left: 4px solid #f59e0b;
          border-radius: var(--radius-sm);
          font-size: 0.8rem;
          color: #92400e;
          line-height: 1.45;
        }

        .reader-callout-icon {
          color: #f59e0b;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .reader-section h4 {
          font-size: 0.92rem;
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 6px;
        }

        .reader-section p {
          font-size: 0.82rem;
          line-height: 1.5;
          color: var(--text-main);
        }

        .reader-steps-container {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .reader-step-card {
          padding: 10px;
          background: var(--bg-main);
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-color);
          font-size: 0.8rem;
          line-height: 1.45;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .r-step-badge {
          display: inline-block;
          font-size: 0.68rem;
          font-weight: 800;
          color: #7c3aed;
          text-transform: uppercase;
        }

        .reader-dont-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 6px;
          font-size: 0.8rem;
          color: #be123c;
          padding: 10px;
          background: #fff1f2;
          border-radius: var(--radius-sm);
          border: 1px solid #ffe4e6;
        }

        .reader-danger-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 6px;
          font-size: 0.8rem;
          color: #be123c;
          padding: 10px;
          background: rgba(244, 63, 94, 0.06);
          border-radius: var(--radius-sm);
          border: 1px solid rgba(244, 63, 94, 0.18);
        }

        .reader-loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 30px 16px;
          gap: 12px;
        }

        .reader-loading-spinner-wrap {
          width: 60px;
          height: 60px;
          border-radius: var(--radius-full);
          background: #f5f3ff;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #7c3aed;
        }

        .reader-loading-title {
          font-size: 1.05rem;
          font-weight: 800;
          color: var(--text-main);
          margin: 0;
        }

        .reader-loading-desc {
          font-size: 0.85rem;
          color: var(--text-muted);
          line-height: 1.5;
          max-width: 420px;
          margin: 0;
        }

        .reader-loading-warning {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 14px;
          background: #fffbeb;
          border-left: 4px solid #f59e0b;
          border-radius: var(--radius-sm);
          font-size: 0.78rem;
          color: #92400e;
          text-align: left;
          margin-top: 10px;
        }

        /* Fixed and Perfectly Balanced Modal Footer Buttons */
        .reader-actions-footer {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 10px;
          padding-top: 14px;
          border-top: 1px solid var(--border-color);
        }

        .reader-btn-call {
          flex: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          height: 42px;
          min-height: 42px;
          padding: 0 16px;
          background: #0d9488 !important;
          color: #ffffff !important;
          border-radius: var(--radius-md);
          font-weight: 700;
          font-size: 0.88rem;
          text-decoration: none !important;
          box-shadow: 0 2px 8px rgba(13, 148, 136, 0.25);
          transition: all 0.2s;
          border: none;
        }

        .reader-btn-call:hover {
          background: #0f766e !important;
          color: #ffffff !important;
          text-decoration: none !important;
        }

        .reader-btn-dismiss {
          height: 42px;
          min-height: 42px;
          padding: 0 18px;
          border-radius: var(--radius-md);
          font-weight: 600;
          font-size: 0.88rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1.5px solid var(--border-color);
          background: var(--bg-main);
          color: var(--text-main);
          cursor: pointer;
          transition: all 0.2s;
        }

        .reader-btn-dismiss:hover {
          background: var(--bg-card-hover, rgba(0, 0, 0, 0.05));
        }
      `
      }</style>
    </div>
  );
};

