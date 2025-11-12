 'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { realtimeService } from '../services/realtime';
import { InventoryItem, PromoData, NotificationData } from '../types/inventory';
import { showNotification } from '../utils/notifications';

interface InventoryContextType {
  inventory: InventoryItem[];
  promos: PromoData[];
  isConnected: boolean;
  lastUpdate: Date | null;
  loading: boolean;
  updateInventory: (itemId: string, quantity: number) => Promise<void>;
  updateAvailability: (itemId: string, isAvailable: boolean) => Promise<void>;
  updatePromo: (promo: PromoData) => Promise<void>;
  addPromo: (promo: Omit<PromoData, 'id'>) => Promise<void>;
  deletePromo: (promoId: string) => Promise<void>;
  getAvailableColors: (modelId: string) => string[];
  getStockLevel: (modelId: string, colorName: string) => number;
  getActivePromos: (modelId: string) => PromoData[];
  refreshData: () => Promise<void>;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [promos, setPromos] = useState<PromoData[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper to resolve HTTP API base (prefer explicit API base over deriving from WSS)
  const getApiBase = () => {
    const explicit = (process.env.NEXT_PUBLIC_API_BASE || '').trim();
    if (explicit) return explicit.replace(/\/$/, '');
    const wsUrl = process.env.NEXT_PUBLIC_WSS_URL || '';
    if (!wsUrl) return '';
    return wsUrl.replace(/^wss:/, 'https:').replace(/^ws:/, 'http:').replace(/\/$/, '');
  };

  // Real-time inventory updates
  const handleInventoryUpdate = useCallback((data: InventoryItem) => {
    setInventory(prev => {
      const index = prev.findIndex(item => item.id === data.id);
      if (index >= 0) {
        const newInventory = [...prev];
        newInventory[index] = { ...data, lastUpdated: new Date(data.lastUpdated) };
        return newInventory;
      } else {
        return [...prev, { ...data, lastUpdated: new Date(data.lastUpdated) }];
      }
    });
    setLastUpdate(new Date());
    
    // Show notification
    showNotification({
      message: `📦 ${data.colorName} stock updated: ${data.quantity} units`,
      type: 'success'
    });
  }, []);

  // Real-time promo updates
  const handlePromoUpdate = useCallback((data: PromoData) => {
    setPromos(prev => {
      const index = prev.findIndex(promo => promo.id === data.id);
      if (index >= 0) {
        const newPromos = [...prev];
        newPromos[index] = {
          ...data,
          startDate: new Date(data.startDate),
          endDate: new Date(data.endDate)
        };
        return newPromos;
      } else {
        return [...prev, {
          ...data,
          startDate: new Date(data.startDate),
          endDate: new Date(data.endDate)
        }];
      }
    });
    setLastUpdate(new Date());
    
    showNotification({
      message: `🎯 Promo updated: ${data.title}`,
      type: 'info'
    });
  }, []);

  // Setup real-time subscriptions
  useEffect(() => {
    const unsubscribeInventory = realtimeService.subscribe('inventory', handleInventoryUpdate);
    const unsubscribePromo = realtimeService.subscribe('promo', handlePromoUpdate);
    
    // Check connection status periodically
    const checkConnection = setInterval(() => {
      setIsConnected(realtimeService.isConnected());
    }, 1000);

    return () => {
      unsubscribeInventory();
      unsubscribePromo();
      clearInterval(checkConnection);
    };
  }, [handleInventoryUpdate, handlePromoUpdate]);

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  // Persistence functions
  const saveToLocalStorage = (inventory: InventoryItem[], promos: PromoData[]) => {
    try {
      localStorage.setItem('honda-inventory', JSON.stringify(inventory));
      localStorage.setItem('honda-promos', JSON.stringify(promos));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  };

  // Helpers: normalize payloads and fetch from API/public
  const normalizeServerPayload = (body: any) => {
    const serverInventory = Array.isArray(body) ? body : (body && body.inventory) || [];
    const serverPromos = (body && !Array.isArray(body)) ? (body.promos || []) : [];

    const parsedInventory = (serverInventory || []).map((item: any) => ({
      ...item,
      lastUpdated: item.lastUpdated ? new Date(item.lastUpdated) : new Date()
    }));

    const parsedPromos = (serverPromos || []).map((promo: any) => ({
      ...promo,
      startDate: promo.startDate ? new Date(promo.startDate) : new Date(),
      endDate: promo.endDate ? new Date(promo.endDate) : new Date()
    }));

    return { parsedInventory, parsedPromos };
  };

  const fetchFromApi = async (apiBase: string) => {
    if (!apiBase) return null;
    try {
      const res = await fetch(`${apiBase}/inventory`, { method: 'GET' });
      if (!res.ok) return null;
      const body = await res.json();
      return normalizeServerPayload(body);
    } catch (err) {
      console.warn('Failed to fetch inventory from API:', err);
      return null;
    }
  };

  const fetchFromPublic = async () => {
    try {
      const res = await fetch('/inventory.json');
      if (!res.ok) return null;
      const body = await res.json();
      return normalizeServerPayload(body);
    } catch (err) {
      return null;
    }
  };

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const apiBase = getApiBase();

      // 1) Prefer API (server reads disk-backed JSON DB)
      const apiResult = await fetchFromApi(apiBase);
      if (apiResult) {
        setInventory(apiResult.parsedInventory);
        setPromos(apiResult.parsedPromos);
        saveToLocalStorage(apiResult.parsedInventory, apiResult.parsedPromos);
        setLoading(false);
        return;
      }

      // 2) Fallback to public seed
      const publicResult = await fetchFromPublic();
      if (publicResult) {
        setInventory(publicResult.parsedInventory);
        setPromos(publicResult.parsedPromos);
        saveToLocalStorage(publicResult.parsedInventory, publicResult.parsedPromos);
        setLoading(false);
        return;
      }

      // 3) Fallback to localStorage
      const savedInventory = localStorage.getItem('honda-inventory');
                  const savedPromos = localStorage.getItem('honda-promos');

                  if (savedInventory && savedPromos) {
                    try {
                      const parsedInventory = JSON.parse(savedInventory).map((item: any) => ({
                        ...item,
                        lastUpdated: new Date(item.lastUpdated)
                      }));
                      const parsedPromos = JSON.parse(savedPromos).map((promo: any) => ({
                        ...promo,
                        startDate: new Date(promo.startDate),
                        endDate: new Date(promo.endDate)
                      }));

                      setInventory(parsedInventory);
                      setPromos(parsedPromos);
                      setLoading(false);
                      return;
                    } catch (error) {
                      console.error('Error parsing localStorage data:', error);
                      localStorage.removeItem('honda-inventory');
                      localStorage.removeItem('honda-promos');
                    }
                  }

                  // 4) Last-resort: embedded sample data (keeps previous sample as fallback)
                  // (existing sample data below will be used)
      const samplePromos: PromoData[] = [
        {
          id: '1',
          modelIds: ['21', '22', '23'],
          title: 'Honda Winner X Mega Promo',
          description: 'FREE Registration + Xtreme Rice Cooker + Premium Helmet',
          freebies: ['LTO Registration', 'Xtreme Rice Cooker', 'Premium Helmet'],
          startDate: new Date('2025-11-03'),
          endDate: new Date('2025-12-31'),
          isActive: true
        },
        {
          id: '2',
          modelIds: ['15'], // CBR150R
          title: 'CBR150R Racing Promo',
          description: 'FREE Racing Jacket + Gloves',
          freebies: ['Racing Jacket', 'Racing Gloves'],
          startDate: new Date('2025-11-01'),
          endDate: new Date('2025-11-30'),
          isActive: true
        }
      ];

  // Use an empty inventory as last-resort and keep the sample promos
  setInventory([]);
  setPromos(samplePromos);
      
  // Save initial data to localStorage
  saveToLocalStorage([], samplePromos);
    } catch (error) {
      showNotification({
        message: 'Failed to load inventory data',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const updateInventory = async (itemId: string, quantity: number) => {
    const item = inventory.find(i => i.id === itemId);
    if (item) {
      const updatedItem = {
        ...item,
        quantity,
        isAvailable: quantity > 0,
        lastUpdated: new Date()
      };

      // Optimistic update
      setInventory(prev => {
        const newInventory = prev.map(i => i.id === itemId ? updatedItem : i);
        // Save to localStorage immediately
        saveToLocalStorage(newInventory, promos);
        return newInventory;
      });
      
      try {
        // Persist to server DB (will broadcast to other clients)
  const apiBase = getApiBase();
        if (apiBase) {
          const res = await fetch(`${apiBase}/inventory`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedItem)
          });
          if (!res.ok) throw new Error('Server failed to persist inventory');
        } else {
          // If no API base, fallback to broadcasting only
          realtimeService.broadcast('inventory', updatedItem);
        }
        
      } catch (error) {
        console.error('Failed to save inventory update:', error);
        // Revert optimistic update on error
        setInventory(prev => prev.map(i => i.id === itemId ? item : i));
        showNotification({
          message: 'Failed to update inventory',
          type: 'error'
        });
      }
    }
  };

  const updateAvailability = async (itemId: string, isAvailable: boolean) => {
    const item = inventory.find(i => i.id === itemId);
    if (item) {
      const updatedItem = {
        ...item,
        isAvailable,
        lastUpdated: new Date()
      };

      // Optimistic update
      setInventory(prev => {
        const newInventory = prev.map(i => i.id === itemId ? updatedItem : i);
        saveToLocalStorage(newInventory, promos);
        return newInventory;
      });

      try {
  const apiBase = getApiBase();
        if (apiBase) {
          const res = await fetch(`${apiBase}/inventory`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedItem)
          });
          if (!res.ok) throw new Error('Server failed to persist availability change');
        } else {
          realtimeService.broadcast('inventory', updatedItem);
        }
      } catch (err) {
        console.error('Failed to persist availability change:', err);
        // Revert on error
        setInventory(prev => prev.map(i => i.id === itemId ? item : i));
      }
    }
  };

  const updatePromo = async (promo: PromoData) => {
    const prevPromos = promos;
    setPromos(prev => {
      const newPromos = prev.map(p => p.id === promo.id ? promo : p);
      saveToLocalStorage(inventory, newPromos);
      return newPromos;
    });

    try {
  const apiBase = getApiBase();
      if (apiBase) {
        const res = await fetch(`${apiBase}/promo`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(promo)
        });
        if (!res.ok) throw new Error('Failed to persist promo');
      } else {
        realtimeService.broadcast('promo', promo);
      }
    } catch (err) {
      console.error('Failed to persist promo update:', err);
      // revert
      setPromos(prevPromos);
    }
  };

  const addPromo = async (promoData: Omit<PromoData, 'id'>) => {
    const newPromo = {
      ...promoData,
      id: Date.now().toString() // Simple ID generation
    };
    const prevPromos = promos;
    setPromos(prev => {
      const newPromos = [...prev, newPromo];
      saveToLocalStorage(inventory, newPromos);
      return newPromos;
    });

    try {
  const apiBase = getApiBase();
      if (apiBase) {
        const res = await fetch(`${apiBase}/promo`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newPromo)
        });
        if (!res.ok) throw new Error('Failed to persist new promo');
      } else {
        realtimeService.broadcast('promo', newPromo);
      }
    } catch (err) {
      console.error('Failed to persist new promo:', err);
      setPromos(prevPromos);
    }
  };

  const deletePromo = async (promoId: string) => {
    const prevPromos = promos;
    setPromos(prev => {
      const newPromos = prev.filter(p => p.id !== promoId);
      saveToLocalStorage(inventory, newPromos);
      return newPromos;
    });

    try {
  const apiBase = getApiBase();
      if (apiBase) {
        const res = await fetch(`${apiBase}/promo?id=${encodeURIComponent(promoId)}`, {
          method: 'DELETE'
        });
        if (!res.ok) throw new Error('Failed to delete promo');
      } else {
        realtimeService.broadcast('promo', { id: promoId, deleted: true });
      }
    } catch (err) {
      console.error('Failed to delete promo:', err);
      setPromos(prevPromos);
    }
  };

  const refreshData = async () => {
    await loadInitialData();
  };

  const getAvailableColors = (modelId: string) => {
    return inventory
      .filter(item => item.modelId === modelId && item.isAvailable && item.quantity > 0)
      .map(item => item.colorName);
  };

  const getStockLevel = (modelId: string, colorName: string) => {
    const item = inventory.find(i => i.modelId === modelId && i.colorName === colorName);
    return item?.quantity || 0;
  };

  const getActivePromos = (modelId: string) => {
    const now = new Date();
    return promos.filter(promo => 
      promo.isActive && 
      promo.modelIds.includes(modelId) &&
      promo.startDate <= now &&
      promo.endDate >= now
    );
  };

  return (
    <InventoryContext.Provider value={{
      inventory,
      promos,
      isConnected,
      lastUpdate,
      loading,
      updateInventory,
      updateAvailability,
      updatePromo,
      addPromo,
      deletePromo,
      getAvailableColors,
      getStockLevel,
      getActivePromos,
      refreshData
    }}>
      {children}
    </InventoryContext.Provider>
  );
}

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within InventoryProvider');
  }
  return context;
};