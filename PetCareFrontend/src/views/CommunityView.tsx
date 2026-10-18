import React, { useState, useMemo } from 'react';
import { CommunityPost, PostType } from '../types';
import { 
  Users, 
  Heart, 
  MessageCircle, 
  Share2, 
  Plus, 
  Search, 
  Send, 
  Video, 
  FileText, 
  ShieldCheck, 
  Sparkles, 
  Edit3, 
  Trash2, 
  Play, 
  X, 
  AlertCircle
} from 'lucide-react';

interface CommunityViewProps {
  posts: CommunityPost[];
  currentUserId?: string;
  initialFormatFilter?: 'all' | 'video' | 'article' | 'verified';
  onToggleLike: (id: string) => void;
  onAddComment: (id: string, text: string) => void;
  onAddPost: (post: CommunityPost) => void;
  onUpdatePost: (post: CommunityPost) => void;
  onDeletePost: (id: string) => void;
  onShowToast: (text: string, type: 'success' | 'warning' | 'info' | 'error') => void;
}

const COMMUNITY_CATEGORIES = [
  'Tất cả',
  'Huấn luyện',
  'Sức khỏe',
  'Dinh dưỡng',
  'Chăm sóc chó',
  'Chăm sóc mèo',
  'Kinh nghiệm thực tế',
  'Đồ dùng thú cưng'
];

type FormatFilter = 'all' | 'video' | 'article' | 'verified' | 'tip';

function extractYoutubeId(url?: string): string | undefined {
  if (!url) return undefined;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : undefined;
}

export const CommunityView: React.FC<CommunityViewProps> = ({
  posts,
  currentUserId = 'user_default',
  initialFormatFilter = 'all',
  onToggleLike,
  onAddComment,
  onAddPost,
  onUpdatePost,
  onDeletePost,
  onShowToast
}) => {
  const [formatFilter, setFormatFilter] = useState<FormatFilter>(initialFormatFilter);
  const [selectedCat, setSelectedCat] = useState('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCommentsPostId, setActiveCommentsPostId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState('');
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

  // Modal State (Create or Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<CommunityPost | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form Fields
  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formCategory, setFormCategory] = useState('Kinh nghiệm thực tế');
  const [formPostType, setFormPostType] = useState<PostType>('article');
  const [formVideoUrl, setFormVideoUrl] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formTags, setFormTags] = useState('');

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      // 1. Format / Type filter
      if (formatFilter === 'video') {
        if (post.postType !== 'video' && !post.videoUrl && !post.youtubeId) return false;
      } else if (formatFilter === 'article') {
        if (post.postType === 'video' && !post.content) return false;
      } else if (formatFilter === 'verified') {
        if (!post.isVerifiedByDoctor) return false;
      } else if (formatFilter === 'tip') {
        if (post.postType !== 'tip' && post.postType !== 'qa') return false;
      }

      // 2. Category filter
      if (selectedCat !== 'Tất cả' && post.category !== selectedCat) {
        return false;
      }

      // 3. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = post.title?.toLowerCase().includes(q);
        const matchContent = post.content?.toLowerCase().includes(q);
        const matchTags = post.tags?.some(t => t.toLowerCase().includes(q));
        if (!matchTitle && !matchContent && !matchTags) return false;
      }

      return true;
    });
  }, [posts, formatFilter, selectedCat, searchQuery]);

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingPost(null);
    setFormTitle('');
    setFormContent('');
    setFormCategory('Kinh nghiệm thực tế');
    setFormPostType('article');
    setFormVideoUrl('');
    setFormImageUrl('');
    setFormTags('');
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (post: CommunityPost) => {
    setEditingPost(post);
    setFormTitle(post.title || '');
    setFormContent(post.content || '');
    setFormCategory(post.category || 'Kinh nghiệm thực tế');
    setFormPostType(post.postType || 'article');
    setFormVideoUrl(post.videoUrl || '');
    setFormImageUrl(post.imageUrl || (post.images && post.images[0]) || '');
    setFormTags(post.tags ? post.tags.join(', ') : '');
    setIsModalOpen(true);
  };

  // Save (Create or Update)
  const handleSavePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      onShowToast('Vui lòng nhập tiêu đề bài viết', 'warning');
      return;
    }
    if (!formContent.trim() && !formVideoUrl.trim()) {
      onShowToast('Vui lòng nhập nội dung chia sẻ hoặc liên kết video', 'warning');
      return;
    }

    const youtubeId = extractYoutubeId(formVideoUrl) || editingPost?.youtubeId;
    const computedType: PostType = formPostType === 'video' || youtubeId ? 'video' : formPostType;
    const tagsArray = formTags.split(',').map(t => t.trim()).filter(Boolean);

    if (editingPost) {
      const updated: CommunityPost = {
        ...editingPost,
        title: formTitle.trim(),
        content: formContent.trim(),
        category: formCategory,
        postType: computedType,
        videoUrl: formVideoUrl.trim() || undefined,
        youtubeId: youtubeId || undefined,
        imageUrl: formImageUrl.trim() || (youtubeId ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg` : undefined),
        tags: tagsArray,
        updatedAt: new Date().toISOString()
      };
      onUpdatePost(updated);
      onShowToast('Đã cập nhật bài viết thành công!', 'success');
    } else {
      const newPost: CommunityPost = {
        id: 'post_' + Date.now(),
        userId: currentUserId,
        authorName: 'Bạn (Người dùng)',
        authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
        title: formTitle.trim(),
        content: formContent.trim(),
        category: formCategory,
        postType: computedType,
        videoUrl: formVideoUrl.trim() || undefined,
        youtubeId: youtubeId || undefined,
        imageUrl: formImageUrl.trim() || (youtubeId ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg` : undefined),
        images: formImageUrl.trim() ? [formImageUrl.trim()] : undefined,
        tags: tagsArray,
        isVerifiedByDoctor: false,
        isPinned: false,
        likes: 0,
        isLiked: false,
        commentsCount: 0,
        comments: [],
        bookmarked: false,
        createdAt: new Date().toISOString()
      };
      onAddPost(newPost);
      onShowToast('Đã đăng bài viết mới lên cộng đồng!', 'success');
    }

    setIsModalOpen(false);
  };

  const handleDeletePost = (id: string) => {
    onDeletePost(id);
    setDeleteConfirmId(null);
    onShowToast('Đã xóa bài viết khỏi cộng đồng', 'info');
  };

  const handleSendComment = (postId: string) => {
    if (!commentInput.trim()) return;
    onAddComment(postId, commentInput.trim());
    setCommentInput('');
    onShowToast('Đã gửi bình luận', 'success');
  };

  const handleShare = (post: CommunityPost) => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.content.slice(0, 100) + '...',
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      onShowToast('Đã sao chép liên kết bài viết vào clipboard', 'success');
    }
  };

  return (
    <div className="view-container community-view" style={{ paddingBottom: '5rem' }}>
      {/* 1. Header & Hero Banner */}
      <div className="community-hero-banner" style={{
        background: 'linear-gradient(135deg, rgba(20, 154, 140, 0.12) 0%, rgba(27, 59, 95, 0.08) 100%)',
        borderRadius: '1.25rem',
        padding: '1.5rem',
        marginBottom: '1.5rem',
        border: '1px solid var(--border-color)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ 
              background: '#149a8c', 
              color: '#ffffff', 
              fontSize: '0.75rem', 
              fontWeight: 700, 
              padding: '0.25rem 0.65rem', 
              borderRadius: '9999px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}>
              <Sparkles size={13} /> Blog & Video Cộng Đồng
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              • {posts.length} bài viết & video
            </span>
          </div>

          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0 0 0.5rem', color: 'var(--text-main)' }}>
            Chia Sẻ Kinh Nghiệm & Video Nuôi Thú Cưng
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: '0 0 1.25rem', maxWidth: '600px', lineHeight: 1.5 }}>
            Không gian mở để bạn viết blog, đăng video hướng dẫn, hỏi đáp mẹo hay và học hỏi kinh nghiệm thực tế từ cộng đồng yêu thú cưng.
          </p>

          <button 
            id="btn-create-post"
            onClick={handleOpenCreate}
            style={{
              background: '#149a8c',
              color: '#ffffff',
              border: 'none',
              borderRadius: '0.75rem',
              padding: '0.75rem 1.4rem',
              fontWeight: 700,
              fontSize: '0.92rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(20, 154, 140, 0.45)',
              transition: 'all 0.2s ease'
            }}
          >
            <Plus size={18} /> Đăng Bài Viết / Video Mới
          </button>
        </div>
      </div>

      {/* 2. Format Filter Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        overflowX: 'auto',
        paddingBottom: '0.5rem',
        marginBottom: '1rem',
        scrollbarWidth: 'none'
      }}>
        <button
          onClick={() => setFormatFilter('all')}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '9999px',
            fontSize: '0.85rem',
            fontWeight: formatFilter === 'all' ? 700 : 500,
            background: formatFilter === 'all' ? '#149a8c' : 'var(--bg-card)',
            color: formatFilter === 'all' ? '#ffffff' : 'var(--text-main)',
            border: '1px solid ' + (formatFilter === 'all' ? '#149a8c' : 'var(--border-color)'),
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            boxShadow: formatFilter === 'all' ? '0 2px 8px rgba(20, 154, 140, 0.3)' : 'none'
          }}
        >
          <Users size={15} /> Tất Cả
        </button>

        <button
          id="tab-filter-video"
          onClick={() => setFormatFilter('video')}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '9999px',
            fontSize: '0.85rem',
            fontWeight: formatFilter === 'video' ? 700 : 500,
            background: formatFilter === 'video' ? '#dc2626' : 'var(--bg-card)',
            color: formatFilter === 'video' ? '#ffffff' : 'var(--text-main)',
            border: '1px solid ' + (formatFilter === 'video' ? '#dc2626' : 'var(--border-color)'),
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            boxShadow: formatFilter === 'video' ? '0 2px 8px rgba(220, 38, 38, 0.3)' : 'none'
          }}
        >
          <Video size={15} /> 🎬 Video Hướng Dẫn
        </button>

        <button
          id="tab-filter-article"
          onClick={() => setFormatFilter('article')}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '9999px',
            fontSize: '0.85rem',
            fontWeight: formatFilter === 'article' ? 700 : 500,
            background: formatFilter === 'article' ? '#059669' : 'var(--bg-card)',
            color: formatFilter === 'article' ? '#ffffff' : 'var(--text-main)',
            border: '1px solid ' + (formatFilter === 'article' ? '#059669' : 'var(--border-color)'),
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            boxShadow: formatFilter === 'article' ? '0 2px 8px rgba(5, 150, 105, 0.3)' : 'none'
          }}
        >
          <FileText size={15} /> 📝 Bài Viết Blog
        </button>

        <button
          id="tab-filter-verified"
          onClick={() => setFormatFilter('verified')}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '9999px',
            fontSize: '0.85rem',
            fontWeight: formatFilter === 'verified' ? 700 : 500,
            background: formatFilter === 'verified' ? '#0284c7' : 'var(--bg-card)',
            color: formatFilter === 'verified' ? '#ffffff' : 'var(--text-main)',
            border: '1px solid ' + (formatFilter === 'verified' ? '#0284c7' : 'var(--border-color)'),
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            boxShadow: formatFilter === 'verified' ? '0 2px 8px rgba(2, 132, 199, 0.3)' : 'none'
          }}
        >
          <ShieldCheck size={15} /> 🩺 Bác Sĩ Xác Thực
        </button>
      </div>

      {/* 3. Search Bar & Category Pills */}
      <div style={{ marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Tìm kiếm bài viết, video, mẹo hay, từ khóa (cắt móng, sốt, hạt...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem 0.75rem 2.75rem',
              borderRadius: '0.75rem',
              border: '1.5px solid var(--border-color)',
              background: 'var(--bg-card)',
              color: 'var(--text-main)',
              fontSize: '0.9rem'
            }}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Category horizontal scrolling list */}
        <div style={{
          display: 'flex',
          gap: '0.4rem',
          overflowX: 'auto',
          paddingBottom: '0.25rem',
          scrollbarWidth: 'none'
        }}>
          {COMMUNITY_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: '0.5rem',
                fontSize: '0.8rem',
                fontWeight: selectedCat === cat ? 700 : 500,
                background: selectedCat === cat ? 'rgba(20, 154, 140, 0.15)' : 'var(--bg-card)',
                color: selectedCat === cat ? '#0f766e' : 'var(--text-muted)',
                border: '1px solid ' + (selectedCat === cat ? 'rgba(20, 154, 140, 0.4)' : 'var(--border-color)'),
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Posts Feed List */}
      <div className="community-posts-list" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {filteredPosts.length === 0 ? (
          <div style={{
            background: 'var(--bg-card)',
            borderRadius: '1rem',
            padding: '3rem 1.5rem',
            textAlign: 'center',
            border: '1px solid var(--border-color)'
          }}>
            <Users size={40} style={{ color: 'var(--text-muted)', marginBottom: '0.75rem', opacity: 0.6 }} />
            <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.1rem', color: 'var(--text-main)' }}>Không tìm thấy bài viết nào</h3>
            <p style={{ margin: '0 0 1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Chưa có bài viết hoặc video phù hợp với bộ lọc hiện tại. Bạn hãy là người đầu tiên chia sẻ nhé!
            </p>
            <button
              onClick={handleOpenCreate}
              style={{
                background: '#149a8c',
                color: '#ffffff',
                border: 'none',
                borderRadius: '0.5rem',
                padding: '0.6rem 1.25rem',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: 'pointer'
              }}
            >
              Đăng bài viết ngay
            </button>
          </div>
        ) : (
          filteredPosts.map(post => {
            const youtubeId = post.youtubeId || extractYoutubeId(post.videoUrl);
            const isPlaying = playingVideoId === post.id;

            return (
              <article 
                key={post.id}
                id={`post-card-${post.id}`}
                style={{
                  background: 'var(--bg-card)',
                  borderRadius: '1rem',
                  border: '1px solid var(--border-color)',
                  boxShadow: 'var(--shadow-sm)',
                  overflow: 'hidden'
                }}
              >
                {/* Post Header */}
                <div style={{ padding: '1rem 1.25rem 0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img 
                      src={post.authorAvatar} 
                      alt={post.authorName} 
                      style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border-color)' }}
                    />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-main)' }}>
                          {post.authorName}
                        </span>
                        {post.isVerifiedByDoctor && (
                          <span 
                            title="Đã xác thực bởi Bác sĩ Thú Y"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.2rem',
                              background: '#ecfdf5',
                              color: '#059669',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              padding: '0.15rem 0.45rem',
                              borderRadius: '4px',
                              border: '1px solid rgba(5, 150, 105, 0.3)'
                            }}
                          >
                            <ShieldCheck size={12} /> Bác Sĩ Xác Thực
                          </span>
                        )}
                        {post.isPinned && (
                          <span style={{
                            background: '#eff6ff',
                            color: '#2563eb',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            padding: '0.15rem 0.45rem',
                            borderRadius: '4px'
                          }}>
                            📌 Ghim
                          </span>
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                        <span>{new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
                        <span>•</span>
                        <span style={{ 
                          background: 'rgba(20, 154, 140, 0.1)', 
                          padding: '0.1rem 0.4rem', 
                          borderRadius: '4px',
                          color: '#0f766e',
                          fontWeight: 600
                        }}>
                          {post.category}
                        </span>
                        {post.postType === 'video' && (
                          <span style={{ color: '#dc2626', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                            <Video size={12} /> Video
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Options Menu (Edit / Delete) */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <button
                      title="Chỉnh sửa bài viết"
                      onClick={() => handleOpenEdit(post)}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: '0.4rem',
                        borderRadius: '0.4rem',
                        color: 'var(--text-muted)',
                        cursor: 'pointer'
                      }}
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      title="Xóa bài viết"
                      onClick={() => setDeleteConfirmId(post.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: '0.4rem',
                        borderRadius: '0.4rem',
                        color: '#ef4444',
                        cursor: 'pointer'
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Post Content */}
                <div style={{ padding: '0 1.25rem 0.75rem' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 0.5rem', color: 'var(--text-main)', lineHeight: 1.4 }}>
                    {post.title}
                  </h3>
                  <p style={{ 
                    fontSize: '0.88rem', 
                    color: 'var(--text-main)', 
                    margin: '0 0 0.75rem', 
                    lineHeight: 1.6, 
                    whiteSpace: 'pre-line',
                    opacity: 0.95 
                  }}>
                    {post.content}
                  </p>

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.75rem' }}>
                      {post.tags.map((tag, i) => (
                        <span key={i} style={{
                          fontSize: '0.75rem',
                          color: 'var(--text-muted)',
                          background: 'rgba(0,0,0,0.05)',
                          padding: '0.15rem 0.5rem',
                          borderRadius: '9999px'
                        }}>
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Video Embed or Thumbnail Player */}
                {youtubeId && (
                  <div style={{ position: 'relative', width: '100%', background: '#000', overflow: 'hidden' }}>
                    {isPlaying ? (
                      <div style={{ position: 'relative', paddingTop: '56.25%', width: '100%' }}>
                        <iframe
                          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`}
                          title={post.title}
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            border: 0
                          }}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    ) : (
                      <div 
                        onClick={() => setPlayingVideoId(post.id)}
                        style={{
                          position: 'relative',
                          paddingTop: '56.25%',
                          width: '100%',
                          cursor: 'pointer',
                          backgroundImage: `url(${post.imageUrl || `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}
                      >
                        {/* Play button overlay */}
                        <div style={{
                          position: 'absolute',
                          top: 0, left: 0, right: 0, bottom: 0,
                          background: 'rgba(0, 0, 0, 0.4)',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem'
                        }}>
                          <div style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '50%',
                            background: '#dc2626',
                            color: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 16px rgba(220, 38, 38, 0.5)'
                          }}>
                            <Play size={24} style={{ marginLeft: '3px' }} />
                          </div>
                          <span style={{ color: '#ffffff', fontSize: '0.82rem', fontWeight: 700, textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
                            Nhấn để phát video
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Regular Image if not a video or no youtubeId */}
                {!youtubeId && post.imageUrl && (
                  <div style={{ maxHeight: '380px', overflow: 'hidden', background: 'rgba(0,0,0,0.03)' }}>
                    <img 
                      src={post.imageUrl} 
                      alt={post.title} 
                      style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }}
                      loading="lazy"
                    />
                  </div>
                )}

                {/* Post Footer / Actions */}
                <div style={{
                  padding: '0.75rem 1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderTop: '1px solid var(--border-color)',
                  fontSize: '0.85rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <button
                      onClick={() => onToggleLike(post.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: post.isLiked ? '#ef4444' : 'var(--text-muted)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        padding: 0
                      }}
                    >
                      <Heart size={18} fill={post.isLiked ? '#ef4444' : 'none'} />
                      <span>{post.likes}</span>
                    </button>

                    <button
                      onClick={() => setActiveCommentsPostId(activeCommentsPostId === post.id ? null : post.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-muted)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        padding: 0
                      }}
                    >
                      <MessageCircle size={18} />
                      <span>{post.commentsCount || (post.comments ? post.comments.length : 0)}</span>
                    </button>
                  </div>

                  <button
                    onClick={() => handleShare(post)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    <Share2 size={18} />
                  </button>
                </div>

                {/* Comment Section (Accordion Drawer) */}
                {activeCommentsPostId === post.id && (
                  <div style={{
                    padding: '1rem 1.25rem',
                    background: 'var(--bg-main)',
                    borderTop: '1px solid var(--border-color)'
                  }}>
                    <h4 style={{ margin: '0 0 0.75rem', fontSize: '0.85rem', color: 'var(--text-main)' }}>
                      Bình luận ({post.comments ? post.comments.length : 0})
                    </h4>

                    {/* Comments list */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '0.75rem' }}>
                      {post.comments && post.comments.length > 0 ? (
                        post.comments.map(c => (
                          <div key={c.id} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                            <img 
                              src={c.avatar} 
                              alt={c.author} 
                              style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                            />
                            <div style={{
                              background: 'var(--bg-card)',
                              borderRadius: '0.5rem',
                              padding: '0.45rem 0.75rem',
                              border: '1px solid var(--border-color)',
                              flex: 1
                            }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.15rem' }}>
                                <span style={{ fontWeight: 700, fontSize: '0.78rem', color: 'var(--text-main)' }}>{c.author}</span>
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{c.time}</span>
                              </div>
                              <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-main)' }}>{c.content}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                          Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
                        </p>
                      )}
                    </div>

                    {/* Add comment input */}
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input
                        type="text"
                        placeholder="Viết bình luận của bạn..."
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSendComment(post.id);
                        }}
                        style={{
                          flex: 1,
                          padding: '0.55rem 0.8rem',
                          borderRadius: '0.5rem',
                          border: '1.5px solid var(--border-color)',
                          background: 'var(--bg-card)',
                          color: 'var(--text-main)',
                          fontSize: '0.85rem'
                        }}
                      />
                      <button
                        onClick={() => handleSendComment(post.id)}
                        style={{
                          background: '#149a8c',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '0.5rem',
                          padding: '0 0.85rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer'
                        }}
                      >
                        <Send size={15} />
                      </button>
                    </div>
                  </div>
                )}
              </article>
            );
          })
        )}
      </div>

      {/* 5. Create / Edit Post Modal */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div 
            className="modal-sheet animate-fade-in" 
            onClick={e => e.stopPropagation()}
            style={{ maxHeight: '90vh', overflow: 'hidden' }}
          >
            {/* Modal Header */}
            <div className="modal-header">
              <h3 className="modal-title">
                {editingPost ? '✏️ Chỉnh Sửa Bài Viết / Video' : '✨ Tạo Bài Viết / Video Mới'}
              </h3>
              <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSavePost} className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Post Type selector */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.4rem', color: '#1e293b' }}>
                  Định dạng bài đăng
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setFormPostType('article')}
                    style={{
                      padding: '0.6rem 0.5rem',
                      borderRadius: '0.6rem',
                      border: '1.5px solid ' + (formPostType === 'article' ? '#149a8c' : '#cbd5e1'),
                      background: formPostType === 'article' ? '#e6f7f5' : '#f8fafc',
                      color: formPostType === 'article' ? '#0f766e' : '#475569',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.3rem'
                    }}
                  >
                    <FileText size={15} /> Bài Viết
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormPostType('video')}
                    style={{
                      padding: '0.6rem 0.5rem',
                      borderRadius: '0.6rem',
                      border: '1.5px solid ' + (formPostType === 'video' ? '#dc2626' : '#cbd5e1'),
                      background: formPostType === 'video' ? '#fee2e2' : '#f8fafc',
                      color: formPostType === 'video' ? '#b91c1c' : '#475569',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.3rem'
                    }}
                  >
                    <Video size={15} /> Video Nhúng
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormPostType('tip')}
                    style={{
                      padding: '0.6rem 0.5rem',
                      borderRadius: '0.6rem',
                      border: '1.5px solid ' + (formPostType === 'tip' ? '#059669' : '#cbd5e1'),
                      background: formPostType === 'tip' ? '#d1fae5' : '#f8fafc',
                      color: formPostType === 'tip' ? '#047857' : '#475569',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.3rem'
                    }}
                  >
                    <Sparkles size={15} /> Mẹo / Hỏi Đáp
                  </button>
                </div>
              </div>

              {/* Title */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.4rem', color: '#1e293b' }}>
                  Tiêu đề bài viết *
                </label>
                <input
                  type="text"
                  placeholder="VD: Kinh nghiệm huấn luyện cún đi vệ sinh, Cách hạ nhiệt mùa hè..."
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '0.7rem 0.9rem',
                    borderRadius: '0.6rem',
                    border: '1.5px solid #cbd5e1',
                    background: '#f8fafc',
                    color: '#0f172a',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Category */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.4rem', color: '#1e293b' }}>
                  Chuyên mục *
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.7rem 0.9rem',
                    borderRadius: '0.6rem',
                    border: '1.5px solid #cbd5e1',
                    background: '#f8fafc',
                    color: '#0f172a',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                >
                  {COMMUNITY_CATEGORIES.filter(c => c !== 'Tất cả').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Video URL (if video format or optional) */}
              {(formPostType === 'video' || formVideoUrl) && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.4rem', color: '#1e293b' }}>
                    Liên kết Video YouTube
                  </label>
                  <input
                    type="url"
                    placeholder="https://www.youtube.com/watch?v=... hoặc https://youtu.be/..."
                    value={formVideoUrl}
                    onChange={(e) => setFormVideoUrl(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.7rem 0.9rem',
                      borderRadius: '0.6rem',
                      border: '1.5px solid #cbd5e1',
                      background: '#f8fafc',
                      color: '#0f172a',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  />
                  {formVideoUrl && extractYoutubeId(formVideoUrl) && (
                    <div style={{ marginTop: '0.4rem', fontSize: '0.78rem', color: '#059669', fontWeight: 600 }}>
                      ✓ Đã nhận diện ID: <strong>{extractYoutubeId(formVideoUrl)}</strong> (Tự động phát trong app)
                    </div>
                  )}
                </div>
              )}

              {/* Image URL */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.4rem', color: '#1e293b' }}>
                  Hình ảnh minh họa (Tùy chọn)
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.7rem 0.9rem',
                    borderRadius: '0.6rem',
                    border: '1.5px solid #cbd5e1',
                    background: '#f8fafc',
                    color: '#0f172a',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Content */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.4rem', color: '#1e293b' }}>
                  Nội dung chi tiết *
                </label>
                <textarea
                  rows={4}
                  placeholder="Mô tả các bước thực hiện, kinh nghiệm nuôi, lời khuyên và các lưu ý quan trọng..."
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.7rem 0.9rem',
                    borderRadius: '0.6rem',
                    border: '1.5px solid #cbd5e1',
                    background: '#f8fafc',
                    color: '#0f172a',
                    fontSize: '0.9rem',
                    lineHeight: 1.5,
                    resize: 'vertical',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Tags */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.4rem', color: '#1e293b' }}>
                  Thẻ phân loại (Cách nhau bằng dấu phẩy)
                </label>
                <input
                  type="text"
                  placeholder="VD: chó con, tiêm phòng, dinh dưỡng, golden"
                  value={formTags}
                  onChange={(e) => setFormTags(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '0.6rem',
                    border: '1.5px solid #cbd5e1',
                    background: '#f8fafc',
                    color: '#0f172a',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Submit Button */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid #e2e8f0' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    padding: '0.65rem 1.25rem',
                    borderRadius: '0.6rem',
                    border: '1.5px solid #cbd5e1',
                    background: '#f1f5f9',
                    color: '#334155',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '0.65rem 1.5rem',
                    borderRadius: '0.6rem',
                    border: 'none',
                    background: '#149a8c',
                    color: '#ffffff',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(20, 154, 140, 0.45)'
                  }}
                >
                  {editingPost ? 'Lưu Thay Đổi' : 'Đăng Bài Ngay'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <div className="modal-backdrop" onClick={() => setDeleteConfirmId(null)}>
          <div 
            className="modal-sheet animate-fade-in" 
            style={{ padding: '24px', textAlign: 'center', alignItems: 'center' }} 
            onClick={e => e.stopPropagation()}
          >
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              background: '#fee2e2',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem'
            }}>
              <AlertCircle size={26} />
            </div>
            <h3 className="modal-title" style={{ margin: '0 0 0.5rem', textAlign: 'center' }}>
              Xác nhận xóa bài viết?
            </h3>
            <p style={{ margin: '0 0 1.5rem', fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Hành động này sẽ xóa vĩnh viễn bài viết cùng toàn bộ bình luận liên quan và không thể khôi phục lại.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', width: '100%' }}>
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                style={{
                  flex: 1,
                  padding: '0.7rem 1.25rem',
                  borderRadius: '0.5rem',
                  border: '1.5px solid var(--border-color)',
                  background: 'var(--bg-main)',
                  color: 'var(--text-main)',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() => handleDeletePost(deleteConfirmId)}
                style={{
                  flex: 1,
                  padding: '0.7rem 1.25rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  background: '#ef4444',
                  color: '#ffffff',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Xóa bài viết
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
