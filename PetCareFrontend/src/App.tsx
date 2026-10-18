import React, { useState, useEffect } from 'react';
import { 
  Pet, 
  HealthRecord, 
  WeightRecord, 
  PetPhoto, 
  Reminder, 
  ReminderType,
  LostPetReport, 
  CommunityPost, 
  UserProfile 
} from './types';
import { storage } from './services/storage';
import { Header } from './components/Header';
import { BottomNav, MainTab } from './components/BottomNav';
import { Toast, ToastMessage } from './components/Toast';
import { OnboardingModal } from './components/OnboardingModal';
import { AddPetModal, AddWeightModal, AddPhotoModal } from './components/QuickActionModals';
import { AuthModal } from './components/AuthModal';
import { apiClient } from './services/apiClient';

// Views
import { HomeView } from './views/HomeView';
import { PetsView } from './views/PetsView';
import { HealthView } from './views/HealthView';
import { EmergencyView } from './views/EmergencyView';
import { LocationsView } from './views/LocationsView';
import { AIAssistantView } from './views/AIAssistantView';
import { LostPetView } from './views/LostPetView';
import { KnowledgeView } from './views/KnowledgeView';
import { VideoView } from './views/VideoView';
import { CommunityView } from './views/CommunityView';
import { RemindersView } from './views/RemindersView';
import { SettingsView } from './views/SettingsView';

import { Download, Sparkles, X } from 'lucide-react';
import './styles/base.css';

const TAB_TITLES: Record<MainTab, string> = {
  home: 'Healthy Pets • Happy Lives',
  pets: 'Hồ Sơ Thú Cưng',
  health: 'Sổ Sức Khỏe & Tiêm Chủng',
  emergency: 'Cẩm Nang Sơ Cứu Khẩn Cấp',
  locations: 'Bệnh Viện & Phòng Khám',
  ai: 'Trợ Lý AI Thú Cưng',
  lost_pet: 'Tìm Thú Cưng Thất Lạc',
  reminders: 'Lịch Hẹn & Nhắc Nhở',
  knowledge: 'Kho Kiến Thức',
  videos: 'Video Hướng Dẫn',
  community: 'Cộng Đồng & Blog',
  settings: 'Cài Đặt & Hồ Sơ'
};

export const App: React.FC = () => {
  // 1. Core State & Navigation History
  const [activeTab, setActiveTab] = useState<MainTab>('home');
  const [tabHistory, setTabHistory] = useState<MainTab[]>(['home']);
  const [pets, setPets] = useState<Pet[]>([]);
  const [activePetId, setActivePetId] = useState<string>('');
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);
  const [weightRecords, setWeightRecords] = useState<WeightRecord[]>([]);
  const [photos, setPhotos] = useState<PetPhoto[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [lostPets, setLostPets] = useState<LostPetReport[]>([]);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [user, setUser] = useState<UserProfile>(storage.getUser());
  const [theme, setTheme] = useState<'light' | 'dark'>(storage.getTheme());
  const [isOnboarded, setIsOnboarded] = useState<boolean>(true);

  // 2. Modals, Auth & Emergency
  const [emergencyQuery, setEmergencyQuery] = useState<string>('');
  const [isAddPetModalOpen, setIsAddPetModalOpen] = useState(false);
  const [isAddWeightModalOpen, setIsAddWeightModalOpen] = useState(false);
  const [isAddPhotoModalOpen, setIsAddPhotoModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [authModalHint, setAuthModalHint] = useState<string>('');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // 3. PWA Install Prompt
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [showPwaBanner, setShowPwaBanner] = useState(false);

  // Load initial data
  useEffect(() => {
    const loadedPets = storage.getPets();
    const currentActiveId = storage.getActivePetId();
    const validPetIds = new Set(loadedPets.map(p => p.id));
    setPets(loadedPets);
    setActivePetId(currentActiveId);
    setHealthRecords(storage.getHealthRecords());
    setWeightRecords(storage.getWeightRecords(currentActiveId));
    setPhotos(storage.getPhotos(currentActiveId));
    
    // Only keep reminders that actually belong to the existing pets
    const allReminders = storage.getReminders();
    const validReminders = allReminders.filter(r => validPetIds.has(r.petId));
    setReminders(validReminders);
    storage.saveReminders(validReminders);

    setLostPets(storage.getLostPets());
    setPosts(storage.getPosts());
    setIsOnboarded(storage.isOnboarded());

    // Apply saved theme
    document.documentElement.setAttribute('data-theme', theme);

    // Listen for PWA install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
      setShowPwaBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Update records when active pet changes
  useEffect(() => {
    if (activePetId) {
      setWeightRecords(storage.getWeightRecords(activePetId));
      setPhotos(storage.getPhotos(activePetId));
    }
  }, [activePetId]);

  const showToast = (text: string, type: 'success' | 'warning' | 'info' | 'error' = 'info') => {
    const newToast: ToastMessage = {
      id: 'toast_' + Date.now(),
      type,
      text
    };
    setToasts(prev => [...prev, newToast]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== newToast.id));
    }, 4000);
  };

  const handleDismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleSelectPet = (id: string) => {
    setActivePetId(id);
    storage.setActivePetId(id);
    const p = pets.find(item => item.id === id);
    if (p) {
      showToast(`Đã chuyển sang hồ sơ của bé ${p.name}`, 'info');
    }
  };

  const handleNavigate = (tab: MainTab) => {
    if (tab !== activeTab) {
      setTabHistory(prev => [...prev, tab]);
      setActiveTab(tab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleGoBack = () => {
    if (tabHistory.length > 1) {
      const nextHistory = [...tabHistory];
      nextHistory.pop();
      const prev = nextHistory[nextHistory.length - 1] || 'home';
      setTabHistory(nextHistory);
      setActiveTab(prev);
    } else {
      setActiveTab('home');
      setTabHistory(['home']);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    storage.setTheme(next);
  };

  const handleOpenAuthModal = (mode: 'login' | 'register' = 'login', hint = '') => {
    setAuthModalMode(mode);
    setAuthModalHint(hint);
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = async (loggedUser: UserProfile) => {
    setUser(loggedUser);
    storage.saveUser(loggedUser);
    try {
      const res = await apiClient.getPets();
      if (res && Array.isArray(res.data)) {
        setPets(res.data);
        storage.savePets(res.data);
        const validPetIds = new Set(res.data.map(p => p.id || p._id));

        if (res.data.length > 0) {
          handleSelectPet(res.data[0].id || res.data[0]._id);
          // If the user has real pets, clean up mock reminders from previous demo pets (milo/luna)
          const allRem = storage.getReminders();
          const cleanRem = allRem.filter(r => validPetIds.has(r.petId));
          setReminders(cleanRem);
          storage.saveReminders(cleanRem);
        } else {
          setActivePetId('');
          storage.setActivePetId('');
          setReminders([]);
          storage.saveReminders([]);
        }
      }
    } catch {
      // If error or empty, keep user session and allow adding pets
    }
  };

  const handleLogout = async () => {
    try {
      await apiClient.logout();
    } catch {
      // ignore
    }
    const guestUser: UserProfile = {
      id: 'guest',
      name: 'Khách (Guest)',
      email: 'guest@petcare.vn',
      phone: '',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      emergencyContact: '1900 8668',
      emergencyContactName: 'Hotline Cấp cứu Thú Y 24/7',
      isLoggedIn: false
    };
    setUser(guestUser);
    storage.saveUser(guestUser);
    showToast('Đã đăng xuất tài khoản thành công', 'info');
  };

  const handleOpenAddPetWithAuth = () => {
    if (!user.isLoggedIn) {
      handleOpenAuthModal('login', 'Đăng nhập hoặc Đăng ký để lưu hồ sơ thú cưng của bạn nhé!');
    } else {
      setIsAddPetModalOpen(true);
    }
  };

  const handleCompleteOnboarding = (newPet?: Pet) => {
    storage.setOnboarded(true);
    setIsOnboarded(true);
    if (newPet) {
      const updated = [newPet, ...pets];
      setPets(updated);
      storage.savePets(updated);
      handleSelectPet(newPet.id);
      showToast(`Chào mừng bé ${newPet.name} gia nhập PetCare! 🐾`, 'success');
    }
  };

  const [editingPet, setEditingPet] = useState<Pet | null>(null);

  const handleOpenEditPet = (pet: Pet) => {
    setEditingPet(pet);
    setIsAddPetModalOpen(true);
  };

  const handleUpdatePet = async (updated: Pet) => {
    const list = pets.map(p => p.id === updated.id ? updated : p);
    setPets(list);
    storage.savePets(list);
    
    // Sync with backend if logged in
    if (user.isLoggedIn) {
      try {
        await apiClient.updatePet(updated.id, updated);
      } catch {
        // saved locally
      }
    }
    showToast(`Đã cập nhật thông tin bé ${updated.name} thành công!`, 'success');
  };

  const handleDeletePet = async (petId: string) => {
    const petToDelete = pets.find(p => p.id === petId);
    const petName = petToDelete ? petToDelete.name : 'thú cưng';
    if (!window.confirm(`Bạn có chắc chắn muốn xóa hồ sơ bé ${petName}? Dữ liệu sẽ không thể khôi phục.`)) {
      return;
    }

    const filtered = pets.filter(p => p.id !== petId);
    setPets(filtered);
    storage.savePets(filtered);

    if (activePetId === petId) {
      const nextId = filtered.length > 0 ? filtered[0].id : '';
      setActivePetId(nextId);
      storage.setActivePetId(nextId);
    }

    // Delete on backend if logged in
    if (user.isLoggedIn) {
      try {
        await apiClient.deletePet(petId);
      } catch {
        // deleted locally
      }
    }

    showToast(`Đã xóa hồ sơ bé ${petName}`, 'info');
  };

  const handleAddPet = async (newPet: Pet) => {
    const updated = [...pets, newPet];
    setPets(updated);
    storage.savePets(updated);
    handleSelectPet(newPet.id);

    // Sync with backend if logged in
    if (user.isLoggedIn) {
      try {
        await apiClient.createPet(newPet);
      } catch {
        // saved locally
      }
    }

    showToast(`Đã thêm thành công thú cưng ${newPet.name}!`, 'success');
  };

  const handleAddWeight = (record: WeightRecord) => {
    storage.addWeightRecord(record);
    setWeightRecords(storage.getWeightRecords(record.petId));
    setPets(storage.getPets());
    showToast(`Đã ghi cân nặng mới: ${record.weight} kg`, 'success');
  };

  const handleAddPhoto = (photo: PetPhoto) => {
    storage.addPhoto(photo);
    setPhotos(storage.getPhotos(photo.petId));
    showToast('Đã lưu ảnh mới vào dòng thời gian phát triển!', 'success');
  };

  const handleAddHealthRecord = (record: HealthRecord) => {
    storage.saveHealthRecord(record);
    setHealthRecords(storage.getHealthRecords());

    // If nextDueDate is set (e.g. tiêm vaccine mũi tiếp theo, tái khám, tẩy giun), auto create a reminder in Reminders system!
    if (record.nextDueDate) {
      const reminderTypeMap: Record<string, ReminderType> = {
        vaccine: 'vaccine',
        deworming: 'deworming',
        checkup: 'checkup',
        medication: 'medication',
        surgery: 'checkup',
        lab: 'checkup'
      };
      const autoRem: Reminder = {
        id: 'rem_auto_' + Date.now(),
        petId: record.petId,
        type: reminderTypeMap[record.type] || 'vaccine',
        title: `Tái khám / Mũi tiếp theo: ${record.title}`,
        date: record.nextDueDate,
        time: '09:00',
        repeat: 'none',
        priority: 'high',
        notes: `Tự động tạo từ sổ sức khỏe (${record.vetClinic || 'Phòng khám'})`,
        isCompleted: false
      };
      storage.saveReminder(autoRem);
      setReminders(storage.getReminders());
    }

    showToast(`Đã thêm bản ghi: ${record.title}`, 'success');
  };

  const handleDeleteHealthRecord = (id: string) => {
    storage.deleteHealthRecord(id);
    setHealthRecords(storage.getHealthRecords());
    showToast('Đã xóa bản ghi sức khỏe', 'info');
  };

  const handleToggleReminder = (id: string) => {
    storage.toggleReminder(id);
    setReminders(storage.getReminders());
  };

  const handleDeleteReminder = (id: string) => {
    storage.deleteReminder(id);
    setReminders(storage.getReminders());
    showToast('Đã xóa nhắc nhở', 'info');
  };

  const handleAddReminder = (reminder: Reminder) => {
    storage.saveReminder(reminder);
    setReminders(storage.getReminders());
    showToast('Đã tạo lịch nhắc hẹn thành công', 'success');
  };

  const handleAddLostPet = (report: LostPetReport) => {
    storage.addLostPet(report);
    setLostPets(storage.getLostPets());
  };

  const handleToggleLikePost = (id: string) => {
    storage.toggleLikePost(id);
    setPosts(storage.getPosts());
  };

  const handleAddComment = (id: string, text: string) => {
    storage.addComment(id, text);
    setPosts(storage.getPosts());
  };

  const handleAddPost = (post: CommunityPost) => {
    storage.savePost(post);
    setPosts(storage.getPosts());
  };

  const handleUpdatePost = (post: CommunityPost) => {
    storage.updatePost(post);
    setPosts(storage.getPosts());
  };

  const handleDeletePost = (id: string) => {
    storage.deletePost(id);
    setPosts(storage.getPosts());
  };

  const handleResetData = () => {
    if (window.confirm('Bạn có chắc chắn muốn đặt lại dữ liệu demo mặc định không?')) {
      storage.resetAllData();
      setPets(storage.getPets());
      setActivePetId(storage.getActivePetId());
      setHealthRecords(storage.getHealthRecords());
      setReminders(storage.getReminders());
      setLostPets(storage.getLostPets());
      setPosts(storage.getPosts());
      showToast('Đã khôi phục dữ liệu ban đầu', 'info');
    }
  };

  const handleInstallPWA = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const choice = await installPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setShowPwaBanner(false);
        showToast('Đã cài đặt PetCare PWA thành công!', 'success');
      }
    }
  };

  const activePet = pets.find(p => p.id === activePetId) || (pets.length > 0 ? pets[0] : null);

  return (
    <div className="app-container">
      {/* Toast Stack */}
      <Toast toasts={toasts} onDismiss={handleDismissToast} />

      {/* PWA Install Banner */}
      {showPwaBanner && (
        <div className="pwa-install-banner animate-fade-in">
          <div className="pwa-left">
            <img src="/logo.png" alt="PetCare" className="pwa-icon-mini" />
            <div className="pwa-text">
              <strong>Cài đặt PetCare</strong>
              <span>Dùng mượt mà như app gốc & truy cập cứu hộ offline</span>
            </div>
          </div>
          <div className="pwa-actions">
            <button className="btn-install-pwa" onClick={handleInstallPWA}>
              <Download size={14} />
              <span>Cài đặt</span>
            </button>
            <button className="btn-dismiss-pwa" onClick={() => setShowPwaBanner(false)}>
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Brand Header */}
      <Header
        pets={pets}
        activePet={activePet}
        onSelectPet={handleSelectPet}
        onOpenAddPet={() => {
          setEditingPet(null);
          handleOpenAddPetWithAuth();
        }}
        onEditPet={handleOpenEditPet}
        emergencyPhone={user.emergencyContact || '19008668'}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        canGoBack={activeTab !== 'home'}
        onGoBack={handleGoBack}
        currentTabTitle={TAB_TITLES[activeTab]}
        isLoggedIn={user.isLoggedIn}
        onOpenAuthModal={() => handleOpenAuthModal('login')}
      />

      {/* Active Screen View */}
      <main className="app-main-content">
        {activeTab === 'home' && (
          <HomeView
            activePet={activePet}
            reminders={reminders}
            healthRecords={healthRecords}
            onNavigate={handleNavigate}
            onOpenAddPet={handleOpenAddPetWithAuth}
            onOpenAddWeight={() => setIsAddWeightModalOpen(true)}
            onOpenAddReminder={() => handleNavigate('reminders')}
            onOpenEmergencyWithQuery={(q) => {
              setEmergencyQuery(q);
              handleNavigate('emergency');
            }}
            onOpenAddPhoto={() => setIsAddPhotoModalOpen(true)}
          />
        )}

        {activeTab === 'pets' && (
          <PetsView
            pets={pets}
            activePet={activePet}
            photos={photos}
            weightRecords={weightRecords}
            reminders={reminders}
            onSelectPet={handleSelectPet}
            onOpenAddPet={() => {
              setEditingPet(null);
              handleOpenAddPetWithAuth();
            }}
            onOpenAddWeight={() => setIsAddWeightModalOpen(true)}
            onOpenAddPhoto={() => setIsAddPhotoModalOpen(true)}
            onOpenHealth={() => handleNavigate('health')}
            onUpdatePet={handleUpdatePet}
            onEditPet={handleOpenEditPet}
            onDeletePet={handleDeletePet}
          />
        )}

        {activeTab === 'health' && (
          <HealthView
            activePet={activePet}
            records={healthRecords}
            onAddRecord={handleAddHealthRecord}
            onDeleteRecord={handleDeleteHealthRecord}
          />
        )}

        {activeTab === 'emergency' && (
          <EmergencyView
            initialQuery={emergencyQuery}
            onNavigateToLocations={() => handleNavigate('locations')}
            onShowToast={showToast}
          />
        )}

        {activeTab === 'locations' && (
          <LocationsView onShowToast={showToast} />
        )}

        {activeTab === 'ai' && (
          <AIAssistantView
            activePet={activePet}
            onNavigateToEmergency={(q) => {
              setEmergencyQuery(q || '');
              handleNavigate('emergency');
            }}
          />
        )}

        {activeTab === 'lost_pet' && (
          <LostPetView
            lostPets={lostPets}
            onAddLostPet={handleAddLostPet}
            onShowToast={showToast}
          />
        )}

        {activeTab === 'reminders' && (
          <RemindersView
            pets={pets}
            activePet={activePet}
            reminders={reminders}
            onToggleReminder={handleToggleReminder}
            onDeleteReminder={handleDeleteReminder}
            onAddReminder={handleAddReminder}
            onShowToast={showToast}
          />
        )}

        {activeTab === 'knowledge' && (
          <CommunityView
            key="community-knowledge"
            posts={posts}
            initialFormatFilter="article"
            onToggleLike={handleToggleLikePost}
            onAddComment={handleAddComment}
            onAddPost={handleAddPost}
            onUpdatePost={handleUpdatePost}
            onDeletePost={handleDeletePost}
            onShowToast={showToast}
          />
        )}

        {activeTab === 'videos' && (
          <CommunityView
            key="community-videos"
            posts={posts}
            initialFormatFilter="video"
            onToggleLike={handleToggleLikePost}
            onAddComment={handleAddComment}
            onAddPost={handleAddPost}
            onUpdatePost={handleUpdatePost}
            onDeletePost={handleDeletePost}
            onShowToast={showToast}
          />
        )}

        {activeTab === 'community' && (
          <CommunityView
            key="community-all"
            posts={posts}
            initialFormatFilter="all"
            onToggleLike={handleToggleLikePost}
            onAddComment={handleAddComment}
            onAddPost={handleAddPost}
            onUpdatePost={handleUpdatePost}
            onDeletePost={handleDeletePost}
            onShowToast={showToast}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            user={user}
            pets={pets}
            theme={theme}
            onToggleTheme={handleToggleTheme}
            onUpdateUser={(u) => {
              setUser(u);
              storage.saveUser(u);
            }}
            onOpenAddPet={handleOpenAddPetWithAuth}
            onResetData={handleResetData}
            onShowToast={showToast}
            onOpenAuthModal={handleOpenAuthModal}
            onLogout={handleLogout}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={handleNavigate}
        unreadRemindersCount={reminders.filter(r => !r.isCompleted).length}
      />

      {/* Auth Modal (Login & Register) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
        onShowToast={showToast}
        initialMode={authModalMode}
        messageHint={authModalHint}
      />

      {/* Onboarding Modal */}
      <OnboardingModal
        isOpen={!isOnboarded}
        onComplete={handleCompleteOnboarding}
      />

      {/* Quick Action Modals */}
      <AddPetModal
        isOpen={isAddPetModalOpen}
        onClose={() => {
          setIsAddPetModalOpen(false);
          setEditingPet(null);
        }}
        onAdd={handleAddPet}
        initialPet={editingPet}
        onUpdate={handleUpdatePet}
      />

      <AddWeightModal
        isOpen={isAddWeightModalOpen}
        activePet={activePet}
        onClose={() => setIsAddWeightModalOpen(false)}
        onAdd={handleAddWeight}
      />

      <AddPhotoModal
        isOpen={isAddPhotoModalOpen}
        activePet={activePet}
        onClose={() => setIsAddPhotoModalOpen(false)}
        onAdd={handleAddPhoto}
      />

      <style>{`
        .app-main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .pwa-install-banner {
          background: var(--primary);
          color: #ffffff;
          padding: 10px 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          z-index: 90;
        }

        .pwa-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .pwa-icon-mini {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: #ffffff;
          padding: 2px;
        }

        .pwa-text {
          display: flex;
          flex-direction: column;
        }

        .pwa-text strong {
          font-size: 0.82rem;
        }

        .pwa-text span {
          font-size: 0.68rem;
          opacity: 0.9;
        }

        .pwa-actions {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .btn-install-pwa {
          min-height: 28px;
          padding: 0 10px;
          background: #ffffff;
          color: var(--primary);
          border-radius: var(--radius-full);
          font-size: 0.74rem;
          font-weight: 700;
        }

        .btn-dismiss-pwa {
          min-height: 28px;
          width: 28px;
          padding: 0;
          color: #ffffff;
          border-radius: var(--radius-full);
        }
      `}</style>
    </div>
  );
};
