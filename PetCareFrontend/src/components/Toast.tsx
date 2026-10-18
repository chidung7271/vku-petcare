import React from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'info' | 'error';
  text: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-stack">
      {toasts.map((t) => (
        <div key={t.id} className={`toast-item ${t.type} animate-fade-in`}>
          <div className="toast-icon">
            {t.type === 'success' && <CheckCircle2 size={18} />}
            {t.type === 'warning' && <AlertTriangle size={18} />}
            {t.type === 'error' && <AlertTriangle size={18} />}
            {t.type === 'info' && <Info size={18} />}
          </div>
          <span className="toast-text">{t.text}</span>
          <button 
            className="toast-close-btn"
            onClick={() => onDismiss(t.id)}
            aria-label="Đóng thông báo"
          >
            <X size={14} />
          </button>
        </div>
      ))}

      <style>{`
        .toast-stack {
          position: fixed;
          top: calc(var(--header-height) + 12px);
          left: 50%;
          transform: translateX(-50%);
          width: calc(100% - 32px);
          max-width: 440px;
          z-index: 200;
          display: flex;
          flex-direction: column;
          gap: 8px;
          pointer-events: none;
        }

        .toast-item {
          pointer-events: auto;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 14px;
          border-radius: var(--radius-md);
          background: var(--bg-card);
          box-shadow: var(--shadow-lg);
          border: 1px solid var(--border-color);
          color: var(--text-main);
          font-size: 0.88rem;
          font-weight: 600;
        }

        .toast-item.success {
          border-left: 4px solid var(--success);
        }
        .toast-item.success .toast-icon {
          color: var(--success);
        }

        .toast-item.warning {
          border-left: 4px solid var(--warning);
        }
        .toast-item.warning .toast-icon {
          color: var(--warning);
        }

        .toast-item.error {
          border-left: 4px solid var(--emergency);
        }
        .toast-item.error .toast-icon {
          color: var(--emergency);
        }

        .toast-item.info {
          border-left: 4px solid var(--primary);
        }
        .toast-item.info .toast-icon {
          color: var(--primary);
        }

        .toast-text {
          flex: 1;
          line-height: 1.35;
        }

        .toast-close-btn {
          min-height: 24px;
          width: 24px;
          padding: 0;
          color: var(--text-muted);
          border-radius: var(--radius-full);
        }
      `}</style>
    </div>
  );
};
