import React, { useState } from 'react';
import { CareVideo } from '../types';
import { CARE_VIDEOS } from '../services/contentData';
import { 
  Play, 
  Clock, 
  Video, 
  Sparkles, 
  CheckCircle2, 
  X, 
  Award 
} from 'lucide-react';

const VIDEO_CATEGORIES = [
  'Tất cả',
  'Grooming',
  'Sơ cứu cơ bản',
  'Chăm sóc y tế',
  'Vệ sinh tai',
  'Đánh răng'
];

export const VideoView: React.FC = () => {
  const [selectedCat, setSelectedCat] = useState('Tất cả');
  const [activeVideo, setActiveVideo] = useState<CareVideo | null>(null);

  const filteredVideos = CARE_VIDEOS.filter(v => 
    selectedCat === 'Tất cả' || v.category === selectedCat
  );

  return (
    <div className="video-container animate-fade-in">
      {/* Header */}
      <div className="video-header card">
        <div className="vh-left">
          <div className="vh-icon-circle">
            <Video size={24} />
          </div>
          <div>
            <h2 className="vh-title">Video Hướng Dẫn Kỹ Năng</h2>
            <p className="vh-sub">Các thao tác vệ sinh, cho uống thuốc & sơ cứu trực quan</p>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="video-cat-bar">
        {VIDEO_CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`v-cat-pill ${selectedCat === cat ? 'active' : ''}`}
            onClick={() => setSelectedCat(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Video Cards Grid */}
      <div className="video-grid">
        {filteredVideos.map(video => (
          <div 
            key={video.id} 
            className="video-card card card-hover"
            onClick={() => setActiveVideo(video)}
          >
            <div className="video-thumb-frame">
              <img src={video.thumbnailUrl} alt={video.title} className="video-thumb" />
              <div className="play-overlay-circle">
                <Play size={20} className="play-icon" />
              </div>
              <span className="duration-badge">⏱️ {video.duration}</span>
              <span className="level-badge">{video.level}</span>
            </div>

            <div className="video-info">
              <span className="v-category-tag">{video.category}</span>
              <h3 className="video-title">{video.title}</h3>
              <p className="video-desc">{video.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Video Playback Modal */}
      {activeVideo && (
        <div className="modal-backdrop" onClick={() => setActiveVideo(null)}>
          <div className="modal-sheet animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{activeVideo.title}</h3>
              <button className="modal-close-btn" onClick={() => setActiveVideo(null)}>✕</button>
            </div>

            <div className="modal-body video-player-body">
              {/* Simulated Responsive Video Player */}
              <div className="video-player-box">
                <iframe
                  src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=0"
                  title={activeVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="embed-iframe"
                />
              </div>

              <div className="player-details">
                <div className="player-meta-row">
                  <span className="badge badge-primary">{activeVideo.category}</span>
                  <span className="duration-pill">⏱️ Thời lượng: {activeVideo.duration}</span>
                  <span className="level-pill">Độ khó: {activeVideo.level}</span>
                </div>

                <p className="player-desc-text">{activeVideo.description}</p>

                <div className="tips-box card">
                  <div className="tips-title">
                    <Award size={16} />
                    <span>Lời khuyên từ Bác sĩ thú y:</span>
                  </div>
                  <p>Hãy chuẩn bị sẵn đồ ăn thưởng (pate/snack) để khen ngợi thú cưng ngay sau khi hoàn thành thao tác. Giữ tâm trạng vui vẻ và bình tĩnh.</p>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-primary" onClick={() => setActiveVideo(null)}>Đóng video</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .video-container {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .video-header {
          display: flex;
          align-items: center;
          padding: 14px 16px;
          background: var(--primary-gradient-subtle);
          border: 1px solid var(--primary-light);
        }

        .vh-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .vh-icon-circle {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-md);
          background: #dc2626;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .vh-title {
          font-size: 1.05rem;
        }

        .vh-sub {
          font-size: 0.74rem;
          color: var(--text-muted);
        }

        .video-cat-bar {
          display: flex;
          gap: 6px;
          overflow-x: auto;
          padding-bottom: 2px;
        }

        .v-cat-pill {
          min-height: 36px;
          padding: 4px 12px;
          border-radius: var(--radius-full);
          border: 1px solid var(--border-color);
          background: var(--bg-card);
          font-size: 0.78rem;
          color: var(--text-muted);
          white-space: nowrap;
        }

        .v-cat-pill.active {
          background: var(--primary);
          color: #ffffff;
          border-color: var(--primary);
          font-weight: 700;
        }

        .video-grid {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .video-card {
          padding: 0;
          overflow: hidden;
          cursor: pointer;
        }

        .video-thumb-frame {
          width: 100%;
          height: 180px;
          position: relative;
          background: #000000;
        }

        .video-thumb {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.88;
        }

        .play-overlay-circle {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 48px;
          height: 48px;
          border-radius: var(--radius-full);
          background: rgba(20, 154, 140, 0.9);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          transition: transform 0.2s;
        }

        .video-card:hover .play-overlay-circle {
          transform: translate(-50%, -50%) scale(1.1);
        }

        .play-icon {
          margin-left: 3px;
        }

        .duration-badge {
          position: absolute;
          bottom: 10px;
          right: 10px;
          background: rgba(0, 0, 0, 0.75);
          color: #ffffff;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 4px;
        }

        .level-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          background: var(--primary);
          color: #ffffff;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: var(--radius-full);
        }

        .video-info {
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .v-category-tag {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--primary);
          text-transform: uppercase;
        }

        .video-title {
          font-size: 0.98rem;
          color: var(--text-main);
          line-height: 1.35;
        }

        .video-desc {
          font-size: 0.8rem;
          color: var(--text-muted);
          line-height: 1.4;
        }

        /* Video Player Modal */
        .video-player-body {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 14px;
        }

        .video-player-box {
          position: relative;
          width: 100%;
          padding-top: 56.25%; /* 16:9 Aspect Ratio */
          background: #000000;
          border-radius: var(--radius-md);
          overflow: hidden;
        }

        .embed-iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: none;
        }

        .player-details {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .player-meta-row {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .player-desc-text {
          font-size: 0.85rem;
          line-height: 1.45;
          color: var(--text-main);
        }

        .tips-box {
          background: var(--primary-soft);
          border: 1px solid var(--primary-light);
          padding: 12px;
          font-size: 0.78rem;
          line-height: 1.45;
          color: var(--text-main);
        }

        .tips-title {
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 700;
          color: var(--primary-dark);
          margin-bottom: 4px;
        }
      `}</style>
    </div>
  );
};
