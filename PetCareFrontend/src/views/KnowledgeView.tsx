import React, { useState } from 'react';
import { KnowledgeArticle } from '../types';
import { KNOWLEDGE_ARTICLES } from '../services/contentData';
import { 
  BookOpen, 
  Search, 
  Clock, 
  ShieldAlert, 
  ChevronRight, 
  FileText, 
  ExternalLink 
} from 'lucide-react';

const CATEGORIES = [
  'Tất cả',
  'Dinh dưỡng',
  'Vaccine',
  'Dấu hiệu cần đi khám',
  'Sơ cứu',
  'Bệnh thường gặp',
  'Hành vi'
];

export const KnowledgeView: React.FC = () => {
  const [selectedCat, setSelectedCat] = useState('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle | null>(null);

  const filteredArticles = KNOWLEDGE_ARTICLES.filter(art => {
    const matchCat = selectedCat === 'Tất cả' || art.category === selectedCat;
    const matchQuery = !searchQuery.trim() || 
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchQuery;
  });

  return (
    <div className="knowledge-container animate-fade-in">
      {/* Header */}
      <div className="knowledge-header card">
        <div className="kh-left">
          <div className="kh-icon-circle">
            <BookOpen size={24} />
          </div>
          <div>
            <h2 className="kh-title">Kho Kiến Thức Y Khoa Thú Cưng</h2>
            <p className="kh-sub">Nguồn tài liệu chuẩn y khoa thú y thế giới (WSAVA, AAHA)</p>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="cat-scroll-bar">
        {CATEGORIES.map(c => (
          <button
            key={c}
            className={`cat-chip ${selectedCat === c ? 'active' : ''}`}
            onClick={() => setSelectedCat(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Search Box */}
      <div className="search-box">
        <Search size={18} className="search-icon" />
        <input 
          type="text" 
          placeholder="Tìm kiếm bài viết (dinh dưỡng, sốt, nôn, độc tố...)"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Articles List */}
      <div className="articles-list">
        {filteredArticles.length > 0 ? (
          filteredArticles.map(art => (
            <div 
              key={art.id} 
              className="article-card card card-hover"
              onClick={() => setSelectedArticle(art)}
            >
              <div className="art-top-row">
                <span className="badge badge-primary">{art.category}</span>
                <span className="art-readtime">⏱️ {art.readTime}</span>
              </div>

              <h3 className="art-title">{art.title}</h3>
              <p className="art-summary">{art.summary}</p>

              {art.warning && (
                <div className="art-warning-tag">
                  <ShieldAlert size={14} />
                  <span>{art.warning}</span>
                </div>
              )}

              <div className="art-footer">
                <span className="art-source">Nguồn: {art.source}</span>
                <ChevronRight size={16} className="arrow" />
              </div>
            </div>
          ))
        ) : (
          <div className="state-container">
            <FileText size={38} className="state-icon" />
            <h4 className="state-title">Không tìm thấy bài viết nào</h4>
            <p className="state-desc">Hãy thử thay đổi từ khóa hoặc chọn danh mục khác.</p>
          </div>
        )}
      </div>

      {/* Detail Article Modal */}
      {selectedArticle && (
        <div className="modal-backdrop" onClick={() => setSelectedArticle(null)}>
          <div className="modal-sheet animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-badge-group">
                <span className="badge badge-primary">{selectedArticle.category}</span>
                <span className="update-date">Cập nhật: {selectedArticle.updatedAt}</span>
              </div>
              <button className="modal-close-btn" onClick={() => setSelectedArticle(null)}>✕</button>
            </div>

            <div className="modal-body article-detail-body">
              <h2 className="detail-article-title">{selectedArticle.title}</h2>
              <p className="detail-article-summary">{selectedArticle.summary}</p>

              {selectedArticle.warning && (
                <div className="detail-warning-box">
                  <ShieldAlert size={18} />
                  <span>{selectedArticle.warning}</span>
                </div>
              )}

              <div className="detail-content-paragraphs">
                {selectedArticle.content.map((p, idx) => (
                  <p key={idx} className="content-paragraph">{p}</p>
                ))}
              </div>

              <div className="detail-meta-box">
                <strong>Tài liệu tham khảo:</strong>
                <p>{selectedArticle.source} • Ngày kiểm duyệt y khoa: {selectedArticle.updatedAt}</p>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-primary" onClick={() => setSelectedArticle(null)}>Đã hiểu</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .knowledge-container {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .knowledge-header {
          display: flex;
          align-items: center;
          padding: 14px 16px;
          background: var(--primary-gradient-subtle);
          border: 1px solid var(--primary-light);
        }

        .kh-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .kh-icon-circle {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-md);
          background: #059669;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .kh-title {
          font-size: 1.05rem;
        }

        .kh-sub {
          font-size: 0.74rem;
          color: var(--text-muted);
        }

        .cat-scroll-bar {
          display: flex;
          gap: 6px;
          overflow-x: auto;
          padding-bottom: 2px;
        }

        .cat-chip {
          min-height: 36px;
          padding: 4px 12px;
          border-radius: var(--radius-full);
          border: 1px solid var(--border-color);
          background: var(--bg-card);
          font-size: 0.78rem;
          color: var(--text-muted);
          white-space: nowrap;
        }

        .cat-chip.active {
          background: var(--primary);
          color: #ffffff;
          border-color: var(--primary);
          font-weight: 700;
        }

        .articles-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .article-card {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 14px;
          cursor: pointer;
        }

        .art-top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .art-readtime {
          font-size: 0.72rem;
          color: var(--text-muted);
        }

        .art-title {
          font-size: 1rem;
          color: var(--text-main);
          line-height: 1.35;
        }

        .art-summary {
          font-size: 0.82rem;
          color: var(--text-muted);
          line-height: 1.4;
        }

        .art-warning-tag {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 10px;
          background: var(--warning-soft);
          color: #b45309;
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          font-weight: 600;
        }

        .art-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 4px;
          padding-top: 8px;
          border-top: 1px solid var(--border-color);
        }

        .art-source {
          font-size: 0.72rem;
          color: var(--text-muted);
        }

        .arrow {
          color: var(--text-muted);
        }

        /* Detail Modal */
        .modal-badge-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .update-date {
          font-size: 0.72rem;
          color: var(--text-muted);
        }

        .detail-article-title {
          font-size: 1.25rem;
          margin-bottom: 8px;
          line-height: 1.35;
        }

        .detail-article-summary {
          font-size: 0.88rem;
          color: var(--text-muted);
          margin-bottom: 14px;
          line-height: 1.45;
        }

        .detail-warning-box {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          padding: 10px 12px;
          border-radius: var(--radius-md);
          background: var(--emergency-soft);
          color: var(--emergency);
          font-size: 0.82rem;
          font-weight: 600;
          margin-bottom: 14px;
        }

        .detail-content-paragraphs {
          display: flex;
          flex-direction: column;
          gap: 10px;
          font-size: 0.88rem;
          line-height: 1.55;
        }

        .detail-meta-box {
          margin-top: 16px;
          padding: 10px;
          background: var(--bg-main);
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
};
