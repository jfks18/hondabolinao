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
  source: string; // 'api' | 'public' | 'sample'
  loadPublicSeed: () => Promise<boolean>;
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
  const [source, setSource] = useState<string>('');
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

  // Real-time inventory updates (from the websocket/realtime service)
  const handleInventoryUpdate = useCallback(async (data: InventoryItem) => {
    setInventory(prev => {
      const index = prev.findIndex(item => item.id === data.id);
      const normalized = { ...data, lastUpdated: data.lastUpdated ? new Date(data.lastUpdated) : new Date() } as InventoryItem;
      if (index >= 0) {
        const newInventory = [...prev];
        newInventory[index] = normalized;
        return newInventory;
      } else {
        return [...prev, normalized];
      }
    });
    setLastUpdate(new Date());
    showNotification({
      message: `📦 ${data.colorName} stock updated: ${data.quantity} units`,
      type: 'success'
    });
  }, []);

  // Real-time promo updates
  const handlePromoUpdate = useCallback((promo: PromoData) => {
    setPromos(prev => {
      const idx = prev.findIndex(p => p.id === promo.id);
      const normalized = {
        ...promo,
        startDate: promo.startDate ? new Date(promo.startDate) : new Date(),
        endDate: promo.endDate ? new Date(promo.endDate) : new Date()
      } as PromoData;
      if (idx >= 0) {
        const newPromos = [...prev];
        newPromos[idx] = normalized;
        return newPromos;
      }
      return [...prev, normalized];
    });
    showNotification({ message: `🎯 Promo updated: ${promo.title}`, type: 'info' });
  }, []);

  // Setup real-time subscriptions
  useEffect(() => {
    const unsubscribeInventory = realtimeService.subscribe('inventory', handleInventoryUpdate);
    const unsubscribePromo = realtimeService.subscribe('promo', handlePromoUpdate);
    
    // Check connection status periodically
    const checkConnection = setInterval(() => {
      setIsConnected(realtimeService.isConnected());
    }, 1000);

    // Periodic data refresh (every 5 minutes) to ensure data consistency
    const periodicRefresh = setInterval(() => {
      if (!loading && source === 'api') {
        console.log('🔄 Periodic data refresh...');
        loadInitialData();
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => {
      unsubscribeInventory();
      unsubscribePromo();
      clearInterval(checkConnection);
      clearInterval(periodicRefresh);
    };
  }, [handleInventoryUpdate, handlePromoUpdate, loading, source]);

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  // (No localStorage persistence) - rely on API or public inventory.json only

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
    // Try a few possible endpoints so this works whether `apiBase` points to
    // the Next.js server (which exposes /api/inventory) or the standalone
    // realtime server (which exposes /inventory).
    const base = apiBase ? apiBase.replace(/\/$/, '') : '';
    const candidates = [] as string[];
    if (base) {
      candidates.push(`${base}/inventory`);
      candidates.push(`${base}/api/inventory`);
    }
    // also try same-origin paths
    candidates.push(`/api/inventory`);
    candidates.push(`/inventory`);

    for (const url of candidates) {
      try {
        // Add cache-busting and better headers for reliability
        const res = await fetch(url, { 
          method: 'GET',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          },
          // Add timestamp to bust cache
          cache: 'no-store'
        });
        if (!res) continue;
        if (res.status === 404) continue;
        if (!res.ok) return null;
        const body = await res.json();
        return normalizeServerPayload(body);
      } catch (err) {
        console.warn(`Failed to fetch from ${url}:`, err);
        // try next candidate
        continue;
      }
    }
    return null;
  };

  // Helper to try multiple endpoints for write operations (POST/PUT/DELETE)
  const tryEndpoints = async (method: string, candidateUrls: string[], body?: any) => {
    for (const url of candidateUrls) {
      try {
        const opts: any = { method };
        if (body !== undefined) {
          opts.headers = { 'Content-Type': 'application/json' };
          opts.body = JSON.stringify(body);
        }
        const res = await fetch(url, opts);
        if (!res) continue;
        if (res.status === 404) continue;
        return res;
      } catch (err) {
        continue;
      }
    }
    return null;
  };

  const fetchFromPublic = async () => {
    try {
      // Add cache-busting for public inventory.json
      const timestamp = Date.now();
      const res = await fetch(`/inventory.json?t=${timestamp}`, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        },
        cache: 'no-store'
      });
      if (!res.ok) return null;
      const body = await res.json();
      return normalizeServerPayload(body);
    } catch (err) {
      console.warn('Failed to fetch from /inventory.json:', err);
      return null;
    }
  };

  const loadInitialData = async (retryCount = 0) => {
    setLoading(true);
    try {
      const apiBase = getApiBase();

      // 1) Prefer API (server reads disk-backed JSON DB) with retry logic
      let apiResult = null;
      const maxRetries = 3;
      const retryDelay = 1000; // 1 second

      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        apiResult = await fetchFromApi(apiBase);
        if (apiResult) break;
        
        if (attempt < maxRetries) {
          console.warn(`API fetch attempt ${attempt + 1} failed, retrying in ${retryDelay}ms...`);
          await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));
        }
      }

      if (apiResult) {
        setInventory(apiResult.parsedInventory);
        setPromos(apiResult.parsedPromos);
        setSource('api');
        setLoading(false);
        console.log('✅ Successfully loaded data from API');
        return;
      }

      // 2) Fallback to public seed
      console.warn('⚠️ API failed, falling back to public inventory.json');
      const publicResult = await fetchFromPublic();
      if (publicResult) {
        setInventory(publicResult.parsedInventory);
        setPromos(publicResult.parsedPromos);
        setSource('public');
        setLoading(false);
        console.log('✅ Successfully loaded data from public/inventory.json');
        return;
      }

      // 3) Fallback to localStorage (removed) - we only use API or public seed

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
  setSource('sample');
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
      setInventory(prev => prev.map(i => i.id === itemId ? updatedItem : i));
      
      try {
        // Persist to server DB (will broadcast to other clients)
        const apiBase = getApiBase();
        const base = apiBase ? apiBase.replace(/\/$/, '') : '';
        const candidates = [] as string[];
        if (base) {
          candidates.push(`${base}/api/inventory`);
          candidates.push(`${base}/inventory`);
        }
        candidates.push(`/api/inventory`);
        candidates.push(`/inventory`);

        const res = await tryEndpoints('POST', candidates, updatedItem);
        if (!res) {
          // If no API responded, fallback to broadcasting only
          realtimeService.broadcast('inventory', updatedItem);
        } else if (!res.ok) {
          throw new Error('Server failed to persist inventory');
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
      setInventory(prev => prev.map(i => i.id === itemId ? updatedItem : i));

      try {
        const apiBase = getApiBase();
        const base = apiBase ? apiBase.replace(/\/$/, '') : '';
        const candidates = [] as string[];
        if (base) {
          candidates.push(`${base}/api/inventory`);
          candidates.push(`${base}/inventory`);
        }
        candidates.push(`/api/inventory`);
        candidates.push(`/inventory`);

        const res = await tryEndpoints('POST', candidates, updatedItem);
        if (!res || !res.ok) throw new Error('Server failed to persist availability change');
      } catch (err) {
        console.error('Failed to persist availability change:', err);
        // Revert on error
        setInventory(prev => prev.map(i => i.id === itemId ? item : i));
      }
    }
  };

  const updatePromo = async (promo: PromoData) => {
    const prevPromos = promos;
    setPromos(prev => prev.map(p => p.id === promo.id ? promo : p));

    try {
      const apiBase = getApiBase();
      const base = apiBase ? apiBase.replace(/\/$/, '') : '';
      const candidates: string[] = [];
      if (base) {
        candidates.push(`${base}/api/promo`);
        candidates.push(`${base}/promo`);
      }
      candidates.push(`/api/promo`);
      candidates.push(`/promo`);

      const res = await tryEndpoints('POST', candidates, promo);
      if (!res || !res.ok) throw new Error('Failed to persist promo');
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
    setPromos(prev => [...prev, newPromo]);

    try {
      const apiBase = getApiBase();
      const base = apiBase ? apiBase.replace(/\/$/, '') : '';
      const candidates: string[] = [];
      if (base) {
        candidates.push(`${base}/api/promo`);
        candidates.push(`${base}/promo`);
      }
      candidates.push(`/api/promo`);
      candidates.push(`/promo`);

      const res = await tryEndpoints('POST', candidates, newPromo);
      if (!res || !res.ok) throw new Error('Failed to persist new promo');
    } catch (err) {
      console.error('Failed to persist new promo:', err);
      setPromos(prevPromos);
    }
  };

  const deletePromo = async (promoId: string) => {
    const prevPromos = promos;
    setPromos(prev => prev.filter(p => p.id !== promoId));

    try {
      const apiBase = getApiBase();
      const base = apiBase || '';
      const res = await fetch(`${base}/api/promo?id=${encodeURIComponent(promoId)}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete promo');
    } catch (err) {
      console.error('Failed to delete promo:', err);
      setPromos(prevPromos);
    }
  };

  const refreshData = async () => {
    console.log('🔄 Refreshing inventory data...');
    await loadInitialData();
  };

  const loadPublicSeed = async () => {
    const publicResult = await fetchFromPublic();
    if (publicResult) {
      setInventory(publicResult.parsedInventory);
      setPromos(publicResult.parsedPromos);
      setSource('public');
      return true;
    }
    return false;
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
      source,
      updateInventory,
      updateAvailability,
      updatePromo,
      addPromo,
      deletePromo,
      getAvailableColors,
      getStockLevel,
      getActivePromos,
      refreshData
      ,
      loadPublicSeed
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