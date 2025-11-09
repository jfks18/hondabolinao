'use client';

import { NotificationData } from '../types/inventory';

let notificationId = 0;

interface ShowNotificationOptions {
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
  autoHide?: boolean;
  duration?: number;
}

export function showNotification(options: ShowNotificationOptions) {
  const { message, type, autoHide = true, duration = 3000 } = options;
  
  // Create toast notification element
  const toast = document.createElement('div');
  toast.id = `notification-${++notificationId}`;
  
  // Set styles based on type
  const typeStyles = {
    success: 'bg-green-500 text-white',
    warning: 'bg-yellow-500 text-white',
    error: 'bg-red-500 text-white',
    info: 'bg-blue-500 text-white'
  };

  const typeIcons = {
    success: '✅',
    warning: '⚠️',
    error: '❌',
    info: 'ℹ️'
  };

  toast.className = `fixed top-4 right-4 ${typeStyles[type]} px-4 py-3 rounded-lg shadow-lg z-50 max-w-sm animate-slide-in-right`;
  toast.innerHTML = `
    <div class="flex items-center space-x-2">
      <span class="text-lg">${typeIcons[type]}</span>
      <span class="text-sm font-medium">${message}</span>
      <button onclick="this.parentElement.parentElement.remove()" class="ml-2 text-white hover:text-gray-200">
        ✕
      </button>
    </div>
  `;

  // Add to DOM
  document.body.appendChild(toast);

  // Auto-hide if enabled
  if (autoHide) {
    setTimeout(() => {
      if (document.getElementById(toast.id)) {
        toast.classList.add('animate-slide-out-right');
        setTimeout(() => {
          document.body.removeChild(toast);
        }, 300);
      }
    }, duration);
  }
}

export function showSuccessNotification(message: string, duration?: number) {
  showNotification({ message, type: 'success', duration });
}

export function showErrorNotification(message: string, duration?: number) {
  showNotification({ message, type: 'error', duration });
}

export function showWarningNotification(message: string, duration?: number) {
  showNotification({ message, type: 'warning', duration });
}

export function showInfoNotification(message: string, duration?: number) {
  showNotification({ message, type: 'info', duration });
}

// Clear all notifications
export function clearAllNotifications() {
  const notifications = document.querySelectorAll('[id^="notification-"]');
  notifications.forEach(notification => {
    notification.remove();
  });
}