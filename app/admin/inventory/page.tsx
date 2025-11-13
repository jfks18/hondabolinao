'use client';

import { useState, useEffect } from 'react';
import { useInventory } from '../../contexts/InventoryContext';
import { InventoryItem, PromoData } from '../../types/inventory';

// Motorcycle model names mapping
const motorcycleNames: { [key: string]: string } = {
  '1': 'Honda NAVi',
  '2': 'Honda BeAT (Playful)',
  '3': 'Honda BeAT (Premium)',
  '4': 'Honda CLICK125',
  '5': 'Honda CLICK125 (Special Edition)',
  '6': 'Honda Giorno+',
  '7': 'TMX125 Alpha',
  '8': 'TMX SUPREMO',
  '9': 'Honda Wave RSX (Drum)',
  '10': 'Wave RSX (DISC)',
  '11': 'Honda XRM125 DS',
  '12': 'Honda XRM125 DSX',
  '13': 'Honda XRM125 MOTARD',
  '14': 'Honda RS125',
  '15': 'Honda CBR150R',
  '16': 'Honda CLICK160',
  '17': 'Honda PCX160 (Standard Type)',
  '18': 'Honda PCX160 (RoadSync)',
  '19': 'ADV160',
  '20': 'Honda ADV350',
  '21': 'Honda Winner X (Standard)',
  '22': 'Honda Winner X (ABS Premium)',
  '23': 'Honda Winner X (ABS Racing Type)'
};

export default function RealTimeInventoryAdmin() {
  const { 
    inventory, 
    promos, 
    isConnected, 
    lastUpdate,
    loading,
    source,
    loadPublicSeed,
    updateInventory, 
    updateAvailability, 
    updatePromo,
    addPromo,
    deletePromo,
    refreshData
  } = useInventory();
  
  const [selectedModel, setSelectedModel] = useState('');
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  // Auto-refresh data when admin page loads
  useEffect(() => {
    console.log('🔄 Admin page mounted, refreshing inventory data...');
    refreshData();
  }, [refreshData]);

  // Group inventory by motorcycle model
  const groupInventoryByModel = () => {
    const grouped: { [key: string]: InventoryItem[] } = {};
    
    inventory.forEach(item => {
      if (!grouped[item.modelId]) {
        grouped[item.modelId] = [];
      }
      grouped[item.modelId].push(item);
    });
    
    return grouped;
  };

  const groupedInventory = groupInventoryByModel();
  const [newPromo, setNewPromo] = useState({
    title: '',
    description: '',
    freebies: '',
    modelIds: '',
    startDate: '',
    endDate: '',
    isActive: true
  });

  // Real-time quantity updater
  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 0) return;
    
    setIsUpdating(itemId);
    try {
      await updateInventory(itemId, newQuantity);
      setTimeout(() => setIsUpdating(null), 500);
    } catch (error) {
      console.error('Update failed:', error);
      setIsUpdating(null);
    }
  };

  // Real-time availability toggle
  const handleAvailabilityToggle = async (itemId: string, isAvailable: boolean) => {
    setIsUpdating(itemId);
    try {
      await updateAvailability(itemId, isAvailable);
      setTimeout(() => setIsUpdating(null), 500);
    } catch (error) {
      console.error('Update failed:', error);
      setIsUpdating(null);
    }
  };

  // Handle promo toggle
  const handlePromoToggle = async (promo: PromoData) => {
    try {
      await updatePromo({ ...promo, isActive: !promo.isActive });
    } catch (error) {
      console.error('Promo update failed:', error);
    }
  };

  // Handle new promo creation
  const handleCreatePromo = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPromo.title || !newPromo.description) return;
    
    try {
      await addPromo({
        title: newPromo.title,
        description: newPromo.description,
        freebies: newPromo.freebies.split(',').map(f => f.trim()).filter(Boolean),
        modelIds: newPromo.modelIds.split(',').map(m => m.trim()).filter(Boolean),
        startDate: new Date(newPromo.startDate),
        endDate: new Date(newPromo.endDate),
        isActive: newPromo.isActive
      });
      
      // Reset form
      setNewPromo({
        title: '',
        description: '',
        freebies: '',
        modelIds: '',
        startDate: '',
        endDate: '',
        isActive: true
      });
    } catch (error) {
      console.error('Failed to create promo:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading inventory data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header with Real-time Status */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-red-600">
              🏍️ Honda 3S Real-Time Inventory
            </h1>
            
            <div className="flex items-center space-x-4">
              {/* Data source badge */}
              <div className="text-sm px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                Source: <span className="font-semibold ml-2">{source || 'unknown'}</span>
              </div>

              <div className="text-sm px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                Items: <span className="font-semibold ml-2">{inventory.length}</span>
              </div>

              {/* Load public seed button (manual) */}
              <button
                onClick={async () => {
                  const ok = await loadPublicSeed();
                  if (!ok) alert('Failed to load public/inventory.json');
                }}
                className="bg-yellow-400 text-white px-3 py-1 rounded-lg hover:bg-yellow-500 transition-colors"
              >
                Load public seed
              </button>
              {/* Connection Status */}
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${
                  isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                }`} />
                <span className={`text-sm font-medium ${
                  isConnected ? 'text-green-600' : 'text-red-600'
                }`}>
                  {isConnected ? '🔄 Live Updates' : '❌ Disconnected'}
                </span>
              </div>
              
              {/* Last Update Time */}
              {lastUpdate && (
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  ⏱️ {lastUpdate.toLocaleTimeString()}
                </span>
              )}

              {/* Refresh Button */}
              <button
                onClick={refreshData}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                🔄 Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Grouped Motorcycle Inventory */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-6 flex items-center">
            🏍️ Motorcycle Inventory Management
            <span className="ml-3 bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
              {Object.keys(groupedInventory).length} Models
            </span>
            <span className="ml-2 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
              {inventory.length} Color Variants
            </span>
          </h2>
          
          <div className="space-y-8">
            {Object.entries(groupedInventory)
              .sort(([a], [b]) => parseInt(a) - parseInt(b))
              .map(([modelId, items]) => {
                // Ensure available colors are shown first
                const sortedItems = items.slice().sort((a, b) => {
                  const aAvailable = a.isAvailable && a.quantity > 0 ? 0 : 1;
                  const bAvailable = b.isAvailable && b.quantity > 0 ? 0 : 1;
                  return aAvailable - bAvailable;
                });

                // Find the first available color to surface in the model header
                const firstAvailable = sortedItems.find(i => i.isAvailable && i.quantity > 0);

                return (
                <div key={modelId} className="border border-gray-300 rounded-xl p-6 bg-gray-50">
                  {/* Motorcycle Model Header */}
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-300">
                    <div className="flex items-center space-x-4">
                      <div className="bg-red-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg">
                        {modelId}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">
                          {motorcycleNames[modelId] || `Model ${modelId}`}
                        </h3>
                        <p className="text-gray-600">{items.length} color variants available</p>
                        {firstAvailable ? (
                          <div className="flex items-center mt-1">
                            <div
                              className="w-4 h-4 rounded-full mr-2 border-2 border-white shadow-sm"
                              style={{ backgroundColor: firstAvailable.colorHex }}
                              title={firstAvailable.colorName}
                            />
                            <span className="text-sm text-green-600 font-medium">
                              Available: {firstAvailable.colorName} ({firstAvailable.quantity} units)
                            </span>
                          </div>
                        ) : (
                          <div className="mt-1">
                            <span className="text-sm text-red-600 font-medium">No available colors</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-700">Total Stock</div>
                        <div className="text-2xl font-bold text-blue-600">
                          {items.reduce((sum, item) => sum + item.quantity, 0)} units
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-700">Available</div>
                        <div className={`text-lg font-bold ${
                          items.filter(item => item.isAvailable && item.quantity > 0).length === items.length
                            ? 'text-green-600' 
                            : items.filter(item => item.isAvailable && item.quantity > 0).length === 0
                            ? 'text-red-600'
                            : 'text-yellow-600'
                        }`}>
                          {items.filter(item => item.isAvailable && item.quantity > 0).length}/{items.length}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Color Variants Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {sortedItems.map(item => (
              <div 
                key={item.id} 
                className={`border-2 rounded-xl p-4 transition-all duration-300 bg-white ${
                  isUpdating === item.id 
                    ? 'border-blue-400 bg-blue-50 transform scale-105 shadow-lg' 
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}
              >
                {/* Color Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: item.colorHex }}
                      title={item.colorName}
                    />
                    <div>
                      <h4 className="font-bold text-gray-800 text-sm">{item.colorName}</h4>
                      <p className="text-xs text-gray-500">ID: {item.id}</p>
                    </div>
                  </div>
                  
                  <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                    !item.isAvailable || item.quantity === 0
                      ? 'bg-red-100 text-red-700'
                      : item.quantity <= 3
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {item.quantity} units
                  </div>
                </div>
                
                {/* Quantity Controls */}
                <div className="mb-3">
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Stock Quantity
                  </label>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleQuantityChange(item.id, Math.max(0, item.quantity - 1))}
                      className="w-8 h-8 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors font-bold text-sm"
                      disabled={isUpdating === item.id}
                    >
                      −
                    </button>
                    
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 0)}
                      className="flex-1 p-2 border-2 rounded-lg text-center font-bold text-sm"
                      min="0"
                      disabled={isUpdating === item.id}
                    />
                    
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      className="w-8 h-8 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition-colors font-bold text-sm"
                      disabled={isUpdating === item.id}
                    >
                      +
                    </button>
                  </div>
                </div>
                
                {/* Availability Toggle */}
                <div className="mb-3">
                  <button
                    onClick={() => handleAvailabilityToggle(item.id, !item.isAvailable)}
                    disabled={isUpdating === item.id}
                    className={`w-full py-2 px-3 rounded-lg font-bold text-xs transition-all duration-200 ${
                      item.isAvailable 
                        ? 'bg-green-500 text-white hover:bg-green-600' 
                        : 'bg-red-500 text-white hover:bg-red-600'
                    } ${isUpdating === item.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isUpdating === item.id ? (
                      <span className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-3 w-3 border-2 border-white mr-1"></div>
                        Updating...
                      </span>
                    ) : (
                      item.isAvailable ? '✅ AVAILABLE' : '❌ UNAVAILABLE'
                    )}
                  </button>
                </div>
                
                {/* Stock Status */}
                <div className="bg-gray-50 rounded-lg p-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-gray-700">Last Updated:</span>
                    <span className="text-gray-500">{item.lastUpdated.toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
                );
              })}
          </div>
        </div>
        {/* Promo Management Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Active Promos */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-6 flex items-center">
              🎯 Active Promos
              <span className="ml-3 bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-sm">
                {promos.filter(p => p.isActive).length} Active
              </span>
            </h2>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {promos.map(promo => (
                <div key={promo.id} className={`border-2 rounded-lg p-4 transition-colors ${
                  promo.isActive ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
                }`}>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold text-gray-800">{promo.title}</h3>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePromoToggle(promo)}
                        className={`px-3 py-1 rounded-full text-sm font-bold transition-colors ${
                          promo.isActive 
                            ? 'bg-green-500 text-white hover:bg-green-600' 
                            : 'bg-gray-400 text-white hover:bg-gray-500'
                        }`}
                      >
                        {promo.isActive ? '🟢 ON' : '⚫ OFF'}
                      </button>
                      
                      <button
                        onClick={() => deletePromo(promo.id)}
                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-3">{promo.description}</p>
                  
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    <div>
                      <strong className="text-gray-700">Period:</strong> 
                      <span className="ml-1 text-gray-600">
                        {promo.startDate.toLocaleDateString()} - {promo.endDate.toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <strong className="text-gray-700">Freebies:</strong>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {promo.freebies.map(freebie => (
                          <span key={freebie} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                            🎁 {freebie}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Create New Promo */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-6">➕ Create New Promo</h2>
            
            <form onSubmit={handleCreatePromo} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Promo Title *
                </label>
                <input
                  type="text"
                  value={newPromo.title}
                  onChange={(e) => setNewPromo(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="e.g., Winter Mega Sale"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  value={newPromo.description}
                  onChange={(e) => setNewPromo(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="e.g., Get amazing freebies with every purchase"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Freebies (comma-separated)
                </label>
                <input
                  type="text"
                  value={newPromo.freebies}
                  onChange={(e) => setNewPromo(prev => ({ ...prev, freebies: e.target.value }))}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="e.g., Helmet, Gloves, Registration"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Model IDs (comma-separated)
                </label>
                <input
                  type="text"
                  value={newPromo.modelIds}
                  onChange={(e) => setNewPromo(prev => ({ ...prev, modelIds: e.target.value }))}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="e.g., 21, 22, 23"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={newPromo.startDate}
                    onChange={(e) => setNewPromo(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={newPromo.endDate}
                    onChange={(e) => setNewPromo(prev => ({ ...prev, endDate: e.target.value }))}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={newPromo.isActive}
                  onChange={(e) => setNewPromo(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="mr-2"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                  Activate immediately
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-bold hover:bg-red-700 transition-colors"
              >
                🚀 Create Promo
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}