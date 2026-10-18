import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  fullScreen?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  fullScreen = false
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className={`modal-sheet ${fullScreen ? 'fullscreen' : ''} animate-fade-in`} 
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-header">
          <div className="modal-title-group">
            <h3 className="modal-title">{title}</h3>
            {subtitle && <p className="modal-subtitle">{subtitle}</p>}
          </div>
          <button 
            className="modal-close-btn" 
            onClick={onClose}
            aria-label="Đóng cửa sổ"
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {children}
        </div>

        {footer && (
          <div className="modal-footer">
            {footer}
          </div>
        )}
      </div>

      <style>{`
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.55);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          z-index: 100;
          display: flex;
          align-items: flex-end;
          justify-content: center;
        }

        .modal-sheet {
          width: 100%;
          max-width: var(--max-app-width);
          max-height: 90vh;
          background: var(--bg-card);
          border-top-left-radius: var(--radius-xl);
          border-top-right-radius: var(--radius-xl);
          border-top: 1px solid var(--border-color);
          box-shadow: var(--shadow-xl);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .modal-sheet.fullscreen {
          height: 100vh;
          max-height: 100vh;
          border-radius: 0;
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          border-bottom: 1px solid var(--border-color);
        }

        .modal-title-group {
          display: flex;
          flex-direction: column;
        }

        .modal-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text-main);
        }

        .modal-subtitle {
          font-size: 0.78rem;
          color: var(--text-muted);
        }

        .modal-close-btn {
          width: 36px;
          height: 36px;
          padding: 0;
          border-radius: var(--radius-full);
          background: var(--secondary-soft);
          color: var(--text-muted);
        }

        .modal-close-btn:hover {
          color: var(--text-main);
        }

        .modal-body {
          padding: 20px;
          overflow-y: auto;
          flex: 1;
        }

        .modal-footer {
          padding: 14px 20px;
          border-top: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 10px;
          background: var(--bg-card);
        }
      `}</style>
    </div>
  );
};
