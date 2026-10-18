import React, { useState, useRef, useEffect } from 'react';
import { Pet } from '../types';
import { aiHealthAssistant, AIResponse } from '../services/aiHealthAssistant';
import { 
  Bot, 
  Send, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  ShieldAlert, 
  HelpCircle,
  Clock
} from 'lucide-react';

interface AIAssistantViewProps {
  activePet: Pet | null;
  onNavigateToEmergency: (query?: string) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  responsePayload?: AIResponse;
  timestamp: string;
}

const SAMPLE_PROMPTS = [
  'Mèo không chịu ăn 2 ngày có sao không?',
  'Chó vừa ăn chocolate phải làm gì?',
  'Mèo bị nôn ra bọt trắng',
  'Chó bị tiêu chảy ra máu',
  'Chó có thể ăn được thức ăn gì?',
  'Lịch tiêm vaccine và tẩy giun định kỳ?'
];

export const AIAssistantView: React.FC<AIAssistantViewProps> = ({
  activePet,
  onNavigateToEmergency
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm_welcome',
      sender: 'ai',
      text: `Xin chào! Tôi là Trợ lý AI Bác sĩ Thú Y của PetCare. ${
        activePet ? `Tôi đang theo dõi sức khỏe cho ${activePet.name} (${activePet.species === 'dog' ? 'Chó' : 'Mèo'} ${activePet.breed}).` : ''
      } Bạn cần tư vấn về triệu chứng, sơ cứu hoặc chế độ dinh dưỡng nào hôm nay?`,
      timestamp: 'Vừa xong'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: 'user_' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsLoading(true);

    try {
      // Build conversation history excluding initial greeting
      const history = messages
        .filter(m => m.id !== 'm_welcome')
        .slice(-6)
        .map(m => ({
          role: (m.sender === 'user' ? 'user' : 'model') as 'user' | 'model',
          text: m.text
        }));

      const response = await aiHealthAssistant.ask(
        text, 
        activePet ? {
          name: activePet.name,
          species: activePet.species,
          breed: activePet.breed,
          weight: activePet.weight,
          age: activePet.estimatedAge,
          allergies: activePet.allergies,
          chronicConditions: activePet.chronicConditions,
          isNeutered: activePet.isNeutered
        } : undefined,
        history
      );

      const aiMsg: ChatMessage = {
        id: 'ai_' + Date.now(),
        sender: 'ai',
        text: response.answer,
        responsePayload: response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch {
      const fallbackMsg: ChatMessage = {
        id: 'ai_err_' + Date.now(),
        sender: 'ai',
        text: 'Xin lỗi, hiện tại hệ thống AI đang bận hoặc gặp sự cố kết nối. Bạn vui lòng thử lại hoặc liên hệ bác sĩ thú y gần nhất nhé!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ai-chat-container animate-fade-in">
      {/* Header Banner */}
      <div className="ai-header-card card">
        <div className="ai-brand-wrap">
          <div className="ai-avatar-circle">
            <Bot size={24} />
          </div>
          <div>
            <h3 className="ai-header-title">Trợ Lý Sức Khỏe AI Thú Y</h3>
            <span className="ai-header-sub">Hỗ trợ phân loại triệu chứng 24/7 bằng tiếng Việt</span>
          </div>
        </div>

        <div className="safety-badge">
          <ShieldAlert size={14} />
          <span>Tư vấn tham khảo y tế</span>
        </div>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="prompts-slider">
        {SAMPLE_PROMPTS.map((prompt, i) => (
          <button 
            key={i} 
            className="prompt-chip"
            onClick={() => handleSendMessage(prompt)}
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Messages List */}
      <div className="messages-stream">
        {messages.map(msg => (
          <div key={msg.id} className={`chat-bubble-row ${msg.sender}`}>
            {msg.sender === 'ai' && (
              <div className="ai-mini-badge">
                <Bot size={16} />
              </div>
            )}

            <div className={`message-bubble ${msg.sender}`}>
              <p className="bubble-text">{msg.text}</p>

              {/* Rich AI Medical Checklist Card */}
              {msg.responsePayload && (
                <div className="medical-payload-card">
                  <div className={`urgency-pill ${msg.responsePayload.urgency.toLowerCase()}`}>
                    <AlertTriangle size={14} />
                    <span>{msg.responsePayload.urgencyBadge}</span>
                  </div>

                  {msg.responsePayload.urgency === 'CRITICAL' && (
                    <button 
                      className="btn-emergency btn-sm w-full"
                      onClick={() => onNavigateToEmergency(msg.text)}
                    >
                      🚨 MỞ TRỢ LÝ CẤP CỨU KHẨN CẤP SOS
                    </button>
                  )}

                  {msg.responsePayload.doList && (
                    <div className="action-box do">
                      <div className="box-title green">
                        <CheckCircle2 size={14} />
                        <span>Nên làm ngay:</span>
                      </div>
                      <ul>
                        {msg.responsePayload.doList.map((d, i) => (
                          <li key={i}>{d}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {msg.responsePayload.dontList && (
                    <div className="action-box dont">
                      <div className="box-title red">
                        <XCircle size={14} />
                        <span>Tuyệt đối không làm:</span>
                      </div>
                      <ul>
                        {msg.responsePayload.dontList.map((d, i) => (
                          <li key={i}>{d}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Follow-up question chips */}
                  {msg.responsePayload.followUpChips.length > 0 && (
                    <div className="followup-chips-row">
                      <span className="followup-label">Câu hỏi liên quan:</span>
                      <div className="chips-list">
                        {msg.responsePayload.followUpChips.map((chip, i) => (
                          <button 
                            key={i} 
                            className="follow-chip"
                            onClick={() => handleSendMessage(chip)}
                          >
                            {chip}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="disclaimer-text">
                    {msg.responsePayload.disclaimer}
                  </div>
                </div>
              )}

              <span className="message-time">{msg.timestamp}</span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="chat-bubble-row ai">
            <div className="ai-mini-badge">
              <Bot size={16} />
            </div>
            <div className="message-bubble ai typing">
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} style={{ height: 1 }} />
      </div>

      {/* Input Form Bar */}
      <form 
        className="chat-input-bar"
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
      >
        <input 
          type="text" 
          placeholder="Mô tả triệu chứng hoặc câu hỏi dinh dưỡng..."
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          className="chat-input"
        />
        <button type="submit" className="send-btn" disabled={!inputText.trim() || isLoading}>
          <Send size={18} />
        </button>
      </form>

      <style>{`
        .ai-chat-container {
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          min-height: calc(100vh - var(--header-height) - var(--nav-height) - 40px);
        }

        .ai-header-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 14px;
          background: var(--bg-card);
        }

        .ai-brand-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .ai-avatar-circle {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-md);
          background: #eff6ff;
          color: #2563eb;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ai-header-title {
          font-size: 0.95rem;
        }

        .ai-header-sub {
          font-size: 0.72rem;
          color: var(--text-muted);
        }

        .safety-badge {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.7rem;
          background: var(--warning-soft);
          color: var(--warning);
          padding: 4px 8px;
          border-radius: var(--radius-full);
          font-weight: 700;
        }

        .prompts-slider {
          display: flex;
          gap: 6px;
          overflow-x: auto;
          padding-bottom: 2px;
        }

        .prompt-chip {
          min-height: 32px;
          padding: 4px 10px;
          border-radius: var(--radius-full);
          border: 1px solid var(--border-color);
          background: var(--bg-card);
          font-size: 0.74rem;
          color: var(--text-muted);
          white-space: nowrap;
        }

        .prompt-chip:hover {
          border-color: var(--primary);
          color: var(--primary);
        }

        .messages-stream {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 12px;
          overflow-y: auto;
          padding-bottom: 140px;
        }

        .chat-bubble-row {
          display: flex;
          gap: 8px;
          align-items: flex-end;
        }

        .chat-bubble-row.user {
          justify-content: flex-end;
        }

        .ai-mini-badge {
          width: 28px;
          height: 28px;
          border-radius: var(--radius-full);
          background: #eff6ff;
          color: #2563eb;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .message-bubble {
          max-width: 85%;
          padding: 12px 14px;
          border-radius: var(--radius-lg);
          position: relative;
        }

        .message-bubble.ai {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-bottom-left-radius: 4px;
        }

        .message-bubble.user {
          background: var(--primary);
          color: #ffffff;
          border-bottom-right-radius: 4px;
        }

        .bubble-text {
          font-size: 0.88rem;
          line-height: 1.45;
        }

        .message-time {
          display: block;
          font-size: 0.65rem;
          color: var(--text-muted);
          margin-top: 4px;
          text-align: right;
        }

        .message-bubble.user .message-time {
          color: rgba(255, 255, 255, 0.7);
        }

        /* Medical Payload Card */
        .medical-payload-card {
          margin-top: 10px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .urgency-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 800;
          width: fit-content;
        }

        .urgency-pill.critical {
          background: var(--emergency-soft);
          color: var(--emergency);
        }

        .urgency-pill.consult_vet {
          background: var(--warning-soft);
          color: var(--warning);
        }

        .urgency-pill.monitor {
          background: var(--primary-soft);
          color: var(--primary);
        }

        .action-box {
          padding: 8px 10px;
          border-radius: var(--radius-sm);
          font-size: 0.8rem;
        }

        .action-box.do {
          background: var(--success-soft);
          border-left: 3px solid #10b981;
        }

        .action-box.dont {
          background: var(--emergency-soft);
          border-left: 3px solid #dc2626;
        }

        .box-title {
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 700;
          margin-bottom: 4px;
        }

        .box-title.green { color: #047857; }
        .box-title.red { color: #dc2626; }

        .action-box ul {
          padding-left: 16px;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .followup-chips-row {
          margin-top: 4px;
        }

        .followup-label {
          font-size: 0.72rem;
          color: var(--text-muted);
          font-weight: 600;
        }

        .chips-list {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 4px;
        }

        .follow-chip {
          min-height: 28px;
          padding: 2px 10px;
          border-radius: var(--radius-full);
          background: var(--secondary-soft);
          border: 1px solid var(--border-color);
          font-size: 0.74rem;
          color: var(--text-main);
        }

        .follow-chip:hover {
          background: var(--primary-soft);
          color: var(--primary);
        }

        .disclaimer-text {
          font-size: 0.7rem;
          color: var(--text-muted);
          font-style: italic;
          margin-top: 4px;
        }

        /* Typing dots */
        .typing {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 10px 16px;
        }

        .dot {
          width: 6px;
          height: 6px;
          background: var(--text-muted);
          border-radius: 999px;
          animation: blink 1.2s infinite;
        }
        .dot:nth-child(2) { animation-delay: 0.2s; }
        .dot:nth-child(3) { animation-delay: 0.4s; }

        @keyframes blink {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.1); }
        }

        /* Input Bar */
        .chat-input-bar {
          position: fixed;
          bottom: calc(var(--nav-height) + env(safe-area-inset-bottom, 0px) + 6px);
          left: 50%;
          transform: translateX(-50%);
          width: calc(100% - 24px);
          max-width: calc(var(--max-app-width) - 24px);
          background: var(--bg-card);
          border: 1.5px solid var(--border-color);
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          padding: 4px 6px 4px 16px;
          box-shadow: var(--shadow-lg);
          z-index: 52;
        }

        .chat-input {
          flex: 1;
          border: none;
          background: transparent;
          font-size: 0.88rem;
          color: var(--text-main);
          outline: none;
        }

        .send-btn {
          width: 38px;
          height: 38px;
          border-radius: var(--radius-full);
          background: var(--primary);
          color: #ffffff;
          padding: 0;
        }

        .send-btn:disabled {
          background: var(--secondary-soft);
          color: var(--text-muted);
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};
