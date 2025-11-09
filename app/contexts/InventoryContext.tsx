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

  const loadInitialData = async () => {
    setLoading(true);
    try {
      // Try to load from localStorage first
      const savedInventory = localStorage.getItem('honda-inventory');
      const savedPromos = localStorage.getItem('honda-promos');
      
      if (savedInventory && savedPromos) {
        try {
          // Load saved data
          const parsedInventory = JSON.parse(savedInventory).map((item: any) => ({
            ...item,
            lastUpdated: new Date(item.lastUpdated)
          }));
          const parsedPromos = JSON.parse(savedPromos).map((promo: any) => ({
            ...promo,
            startDate: new Date(promo.startDate),
            endDate: new Date(promo.endDate)
          }));
          
          // Check for invalid CLICK160 colors (Pearl Organic Green should not exist)
          const hasInvalidClick160 = parsedInventory.some((item: any) => 
            item.modelId === '16' && item.colorName === 'Pearl Organic Green'
          );
          
          if (hasInvalidClick160) {
            // Clear localStorage and reload fresh data
            localStorage.removeItem('honda-inventory');
            localStorage.removeItem('honda-promos');
            console.log('🔧 Detected invalid CLICK160 colors, clearing cache...');
            // Continue to load fresh sample data below
          } else {
            setInventory(parsedInventory);
            setPromos(parsedPromos);
            setLoading(false);
            return;
          }
        } catch (error) {
          console.error('Error parsing localStorage data:', error);
          localStorage.removeItem('honda-inventory');
          localStorage.removeItem('honda-promos');
        }
      }
      
      // If no saved data, load sample data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const sampleInventory: InventoryItem[] = [
        // Honda NAVi (ID: 1)
        { id: 'inv_1_1', modelId: '1', colorName: 'Shasta White', colorHex: '#F8F8FF', quantity: 3, isAvailable: true, lastUpdated: new Date() },
        { id: 'inv_1_2', modelId: '1', colorName: 'Patriot Red', colorHex: '#DC143C', quantity: 2, isAvailable: true, lastUpdated: new Date() },
        { id: 'inv_1_3', modelId: '1', colorName: 'Black', colorHex: '#1C1C1C', quantity: 4, isAvailable: true, lastUpdated: new Date() },
        { id: 'inv_1_4', modelId: '1', colorName: 'Ranger Green R', colorHex: '#355E3B', quantity: 1, isAvailable: true, lastUpdated: new Date() },

        // Honda BeAT Playful (ID: 2)
        { id: 'inv_2_1', modelId: '2', colorName: 'Fighting Red', colorHex: '#DC143C', quantity: 5, isAvailable: true, lastUpdated: new Date() },
        { id: 'inv_2_2', modelId: '2', colorName: 'Pearl Sylvestris Gray', colorHex: '#708090', quantity: 3, isAvailable: true, lastUpdated: new Date() },
        { id: 'inv_2_3', modelId: '2', colorName: 'Pearl Tourmaline Purple', colorHex: '#9966CC', quantity: 2, isAvailable: true, lastUpdated: new Date() },

        // Honda BeAT Premium (ID: 3)
        { id: 'inv_3_1', modelId: '3', colorName: 'Matte Axis Gray Metallic', colorHex: '#708090', quantity: 4, isAvailable: true, lastUpdated: new Date() },
        { id: 'inv_3_2', modelId: '3', colorName: 'Pearl Arctic White', colorHex: '#F8F8FF', quantity: 3, isAvailable: true, lastUpdated: new Date() },
        { id: 'inv_3_3', modelId: '3', colorName: 'Matte Summit Silver Metallic', colorHex: '#C0C0C0', quantity: 2, isAvailable: true, lastUpdated: new Date() },

        // Honda CLICK125 (ID: 4)
        { id: 'inv_4_1', modelId: '4', colorName: 'Pearl Arctic White', colorHex: '#F8F8FF', quantity: 6, isAvailable: true, lastUpdated: new Date() },
        { id: 'inv_4_2', modelId: '4', colorName: 'Pearl Sylvestris Gray', colorHex: '#708090', quantity: 4, isAvailable: true, lastUpdated: new Date() },
        { id: 'inv_4_3', modelId: '4', colorName: 'Stellar Blue Metallic', colorHex: '#4682B4', quantity: 3, isAvailable: true, lastUpdated: new Date() },
        { id: 'inv_4_4', modelId: '4', colorName: 'Obsidian Black Metallic', colorHex: '#1C1C1C', quantity: 2, isAvailable: true, lastUpdated: new Date() },

        // Honda CLICK125 Special Edition (ID: 5)
        { id: 'inv_5_1', modelId: '5', colorName: 'Obsidian Black Metallic', colorHex: '#1C1C1C', quantity: 3, isAvailable: true, lastUpdated: new Date() },
        { id: 'inv_5_2', modelId: '5', colorName: 'Pearl Arctic White', colorHex: '#F8F8FF', quantity: 2, isAvailable: true, lastUpdated: new Date() },
        { id: 'inv_5_3', modelId: '5', colorName: 'Pearl Crimson Red', colorHex: '#DC143C', quantity: 1, isAvailable: true, lastUpdated: new Date() },

        // Honda Giorno+ (ID: 6)
        { id: 'inv_6_1', modelId: '6', colorName: 'Virgin Beige', colorHex: '#F5E6D3', quantity: 2, isAvailable: true, lastUpdated: new Date() },
        { id: 'inv_6_2', modelId: '6', colorName: 'Matte Gunpowder Black Metallic', colorHex: '#2C2C2C', quantity: 3, isAvailable: true, lastUpdated: new Date() },
        { id: 'inv_6_3', modelId: '6', colorName: 'Pearl Jubilee White', colorHex: '#F8F8FF', quantity: 2, isAvailable: true, lastUpdated: new Date() },
        { id: 'inv_6_4', modelId: '6', colorName: 'Piquant Orange', colorHex: '#FF6B35', quantity: 1, isAvailable: true, lastUpdated: new Date() },

        // TMX125 Alpha (ID: 7)
        { id: 'inv_7_1', modelId: '7', colorName: 'Force Silver Metallic', colorHex: '#A8A8A8', quantity: 5, isAvailable: true, lastUpdated: new Date() },
        { id: 'inv_7_2', modelId: '7', colorName: 'Pearl Nightstar Black', colorHex: '#1C1C1C', quantity: 4, isAvailable: true, lastUpdated: new Date() },
        { id: 'inv_7_3', modelId: '7', colorName: 'Candy Luster Red', colorHex: '#DC143C', quantity: 3, isAvailable: true, lastUpdated: new Date() },

        // TMX SUPREMO (ID: 8)
        { id: 'inv_8_1', modelId: '8', colorName: 'Black', colorHex: '#000000', quantity: 4, isAvailable: true, lastUpdated: new Date() },
        { id: 'inv_8_2', modelId: '8', colorName: 'Candy Ruby Red', colorHex: '#DC143C', quantity: 3, isAvailable: true, lastUpdated: new Date() },

        // Honda Wave RSX Drum (ID: 9)
        { id: 'inv_9_1', modelId: '9', colorName: 'Infinity Red', colorHex: '#DC143C', quantity: 6, isAvailable: true, lastUpdated: new Date() },
        { id: 'inv_9_2', modelId: '9', colorName: 'Poseidon Black Metallic', colorHex: '#1C1C1C', quantity: 4, isAvailable: true, lastUpdated: new Date() },

        // Wave RSX DISC (ID: 10)
        { id: 'inv_10_1', modelId: '10', colorName: 'Matte Galaxy Black Metallic', colorHex: '#2C2C2C', quantity: 5, isAvailable: true, lastUpdated: new Date() },
        { id: 'inv_10_2', modelId: '10', colorName: 'Pearl Iceberg White', colorHex: '#FFFEF7', quantity: 3, isAvailable: true, lastUpdated: new Date() },

        // Honda XRM125 DS (ID: 11)
        { id: 'inv_11_1', modelId: '11', colorName: 'Fighting Red', colorHex: '#DC143C', quantity: 4, isAvailable: true, lastUpdated: new Date() },
        { id: 'inv_11_2', modelId: '11', colorName: 'Black', colorHex: '#000000', quantity: 3, isAvailable: true, lastUpdated: new Date() },
        { id: 'inv_11_3', modelId: '11', colorName: 'Aura Blue R', colorHex: '#1E3A8A', quantity: 2, isAvailable: true, lastUpdated: new Date() },

        // Honda XRM125 DSX (ID: 12)
        { id: 'inv_12_1', modelId: '12', colorName: 'Ross White', colorHex: '#FFFFFF', quantity: 3, isAvailable: true, lastUpdated: new Date() },

        // Honda XRM125 MOTARD (ID: 13)
        { id: 'inv_13_1', modelId: '13', colorName: 'Black', colorHex: '#000000', quantity: 2, isAvailable: true, lastUpdated: new Date() },

        // Honda RS125 (ID: 14)
        { id: 'inv_14_1', modelId: '14', colorName: 'Matte Axis Gray Metallic', colorHex: '#6B7280', quantity: 4, isAvailable: true, lastUpdated: new Date() },
        { id: 'inv_14_2', modelId: '14', colorName: 'Victory Red', colorHex: '#DC143C', quantity: 3, isAvailable: true, lastUpdated: new Date() },

        // Honda CBR150R (ID: 15)
        { id: 'inv_15_1', modelId: '15', colorName: 'Winning Red (Honda Tri-Color)', colorHex: '#DC143C', quantity: 2, isAvailable: true, lastUpdated: new Date() },

        // Honda CLICK160 (ID: 16)
        { id: 'inv_16_1', modelId: '16', colorName: 'Matte Gunpowder Black Metallic', colorHex: '#2F3136', quantity: 3, isAvailable: true, lastUpdated: new Date() },
        { id: 'inv_16_2', modelId: '16', colorName: 'Matte Cosmo Silver Metallic', colorHex: '#8E9AAF', quantity: 2, isAvailable: true, lastUpdated: new Date() },
        { id: 'inv_16_3', modelId: '16', colorName: 'Matte Solar Red Metallic', colorHex: '#D32F2F', quantity: 1, isAvailable: true, lastUpdated: new Date() },

        // Honda PCX160 Standard (ID: 17)
        { id: 'inv_17_1', modelId: '17', colorName: 'Vortex Red Metallic', colorHex: '#B91C1C', quantity: 3, isAvailable: true, lastUpdated: new Date() },
        { id: 'inv_17_2', modelId: '17', colorName: 'Pearl Fadeless White', colorHex: '#FAFAFA', quantity: 2, isAvailable: true, lastUpdated: new Date() },
        { id: 'inv_17_3', modelId: '17', colorName: 'Matte Bullet Silver', colorHex: '#8C92AC', quantity: 2, isAvailable: true, lastUpdated: new Date() },

        // Honda PCX160 RoadSync (ID: 18)
        { id: 'inv_18_1', modelId: '18', colorName: 'Matte Gunpowder Black Metallic', colorHex: '#2C2C2C', quantity: 2, isAvailable: true, lastUpdated: new Date() },
        { id: 'inv_18_2', modelId: '18', colorName: 'Pearl Fadeless White', colorHex: '#FAFAFA', quantity: 1, isAvailable: true, lastUpdated: new Date() },

        // ADV160 (ID: 19)
        { id: 'inv_19_1', modelId: '19', colorName: 'Matte Gunpowder Black Metallic', colorHex: '#2C2C2C', quantity: 3, isAvailable: true, lastUpdated: new Date() },
        { id: 'inv_19_2', modelId: '19', colorName: 'Matte Solar Red Metallic', colorHex: '#B91C1C', quantity: 2, isAvailable: true, lastUpdated: new Date() },
        { id: 'inv_19_3', modelId: '19', colorName: 'Matte Pearl Crater White', colorHex: '#F5F5F5', quantity: 1, isAvailable: true, lastUpdated: new Date() },

        // Honda ADV350 (ID: 20)
        { id: 'inv_20_1', modelId: '20', colorName: 'Matte Gunpowder Black Metallic', colorHex: '#2C2C2C', quantity: 1, isAvailable: true, lastUpdated: new Date() },
        { id: 'inv_20_2', modelId: '20', colorName: 'Moscato Red Metallic', colorHex: '#8B2635', quantity: 1, isAvailable: true, lastUpdated: new Date() },

        // Honda Winner X Standard (ID: 21)
        { id: 'inv_21_1', modelId: '21', colorName: 'Pearl Iceberg White', colorHex: '#FFFEF7', quantity: 5, isAvailable: true, lastUpdated: new Date() },
        { id: 'inv_21_2', modelId: '21', colorName: 'Infinity Red', colorHex: '#DC143C', quantity: 3, isAvailable: true, lastUpdated: new Date() },

        // Honda Winner X ABS Premium (ID: 22)
        { id: 'inv_22_1', modelId: '22', colorName: 'Matte Galaxy Black Metallic', colorHex: '#2C2C2C', quantity: 2, isAvailable: true, lastUpdated: new Date() },
        { id: 'inv_22_2', modelId: '22', colorName: 'Matte Meteoric Red Metallic', colorHex: '#8B0000', quantity: 4, isAvailable: true, lastUpdated: new Date() },

        // Honda Winner X ABS Racing Type (ID: 23)
        { id: 'inv_23_1', modelId: '23', colorName: 'Infinity Red', colorHex: '#DC143C', quantity: 1, isAvailable: true, lastUpdated: new Date() }
      ];

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

      setInventory(sampleInventory);
      setPromos(samplePromos);
      
      // Save initial data to localStorage
      saveToLocalStorage(sampleInventory, samplePromos);
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
        // Broadcast to all connected clients
        realtimeService.broadcast('inventory', updatedItem);
        
        // In production, save to database here
        // await saveToDatabase('inventory', updatedItem);
        
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

      setInventory(prev => {
        const newInventory = prev.map(i => i.id === itemId ? updatedItem : i);
        saveToLocalStorage(newInventory, promos);
        return newInventory;
      });
      realtimeService.broadcast('inventory', updatedItem);
    }
  };

  const updatePromo = async (promo: PromoData) => {
    setPromos(prev => {
      const newPromos = prev.map(p => p.id === promo.id ? promo : p);
      saveToLocalStorage(inventory, newPromos);
      return newPromos;
    });
    realtimeService.broadcast('promo', promo);
  };

  const addPromo = async (promoData: Omit<PromoData, 'id'>) => {
    const newPromo = {
      ...promoData,
      id: Date.now().toString() // Simple ID generation
    };
    
    setPromos(prev => {
      const newPromos = [...prev, newPromo];
      saveToLocalStorage(inventory, newPromos);
      return newPromos;
    });
    realtimeService.broadcast('promo', newPromo);
  };

  const deletePromo = async (promoId: string) => {
    setPromos(prev => {
      const newPromos = prev.filter(p => p.id !== promoId);
      saveToLocalStorage(inventory, newPromos);
      return newPromos;
    });
    // You might want a separate delete event type
    realtimeService.broadcast('promo', { id: promoId, deleted: true });
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