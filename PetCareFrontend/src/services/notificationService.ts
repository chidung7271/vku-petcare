export type NotificationPermissionState = 'default' | 'granted' | 'denied' | 'unsupported';

export const notificationService = {
  checkPermission(): NotificationPermissionState {
    if (!('Notification' in window)) {
      return 'unsupported';
    }
    return Notification.permission as NotificationPermissionState;
  },

  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      return false;
    }
    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch {
      return false;
    }
  },

  sendNotification(title: string, options?: NotificationOptions): boolean {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      return false;
    }
    try {
      new Notification(title, {
        icon: '/logo.png',
        badge: '/logo.png',
        ...options
      });
      return true;
    } catch {
      return false;
    }
  }
};
