export interface InventoryItem {
  id: string;
  modelId: string;
  colorName: string;
  colorHex: string;
  quantity: number;
  isAvailable: boolean;
  lastUpdated: Date;
}

export interface PromoData {
  id: string;
  modelIds: string[];
  title: string;
  description: string;
  freebies: string[];
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}

export interface NotificationData {
  id: string;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
  timestamp: Date;
  autoHide?: boolean;
}

export type UpdateType = 'inventory' | 'promo' | 'availability' | 'notification';