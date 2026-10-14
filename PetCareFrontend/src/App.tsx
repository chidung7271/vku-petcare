import React, { useState } from 'react';
import { Header } from './components/Header';
import { BottomNav, MainTab } from './components/BottomNav';
import './styles/base.css';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<MainTab>('home');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const handleToggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  return (
    <div className="app-container">
      <Header
        activePet={null}
        allPets={[]}
        onSelectPet={() => {}}
        emergencyPhone="19008668"
        theme={theme}
        onToggleTheme={handleToggleTheme}
        canGoBack={activeTab !== 'home'}
        onGoBack={() => setActiveTab('home')}
        currentTabTitle="Healthy Pets • Happy Lives"
        isLoggedIn={false}
        onOpenAuthModal={() => {}}
      />

      <main className="app-main-content">
        <div className="home-container animate-fade-in" style={{ padding: '32px 16px', textAlign: 'center' }}>
          <h2>🐾 Chào mừng đến với VKU PetCare</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px', fontSize: '0.95rem' }}>
            Ứng dụng chăm sóc thú cưng thông minh. Các module tính năng đang được phát triển.
          </p>
        </div>
      </main>

      <BottomNav
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        unreadRemindersCount={0}
      />
    </div>
  );
};

export default App;
