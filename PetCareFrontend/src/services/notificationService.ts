export type NotificationPermissionState = 'default' | 'granted' | 'denied' | 'unsupported';

class NotificationService {
  private firedKeys = new Set<string>();

  checkPermission(): NotificationPermissionState {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'unsupported';
    }
    return Notification.permission as NotificationPermissionState;
  }

  async requestPermission(): Promise<boolean> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return false;
    }
    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch {
      return false;
    }
  }

  playNotificationChime() {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      // Harmonic gentle two-tone chime (E5 -> G5)
      osc.frequency.setValueAtTime(659.25, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch {
      // Audio might be blocked by browser autoplay policy before user interaction
    }
  }

  sendNotification(title: string, options?: NotificationOptions): boolean {
    if (typeof window === 'undefined' || !('Notification' in window) || Notification.permission !== 'granted') {
      return false;
    }
    try {
      this.playNotificationChime();
      new Notification(title, {
        icon: '/logo.png',
        badge: '/logo.png',
        ...options,
      });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Tính toán ngày và giờ theo múi giờ Việt Nam (Asia/Ho_Chi_Minh - GMT+7)
   */
  getVietnamDateTime(): { date: string; time: string; timestamp: number } {
    const now = new Date();
    try {
      const formatter = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Ho_Chi_Minh',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });

      const parts = formatter.formatToParts(now);
      const getVal = (t: string) => parts.find(p => p.type === t)?.value || '';
      const date = `${getVal('year')}-${getVal('month')}-${getVal('day')}`;
      const time = `${getVal('hour')}:${getVal('minute')}`;
      return { date, time, timestamp: now.getTime() };
    } catch {
      // Fallback
      const date = now.toISOString().split('T')[0];
      const time = now.toTimeString().slice(0, 5);
      return { date, time, timestamp: now.getTime() };
    }
  }

  /**
   * Kiểm tra thông báo cho lịch hẹn này tại thời điểm này đã bắn chưa (tránh spam trong cùng 1 phút)
   */
  hasFired(key: string): boolean {
    if (this.firedKeys.has(key)) return true;
    try {
      return sessionStorage.getItem(`petcare_fired_${key}`) === '1';
    } catch {
      return false;
    }
  }

  markFired(key: string) {
    this.firedKeys.add(key);
    try {
      sessionStorage.setItem(`petcare_fired_${key}`, '1');
    } catch {
      // Ignore
    }
  }
}

export const notificationService = new NotificationService();
export default notificationService;

