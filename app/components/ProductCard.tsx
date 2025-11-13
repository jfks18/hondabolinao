'use client';

import React, { useState, useEffect } from 'react';
import { useInventory } from '../contexts/InventoryContext';

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  isNew?: boolean;
  isOnSale?: boolean;
  category: string;
  image?: string;
  colors?: {
    name: string;
    hex: string;
    image?: string;
    stock?: number;
  }[];
  specifications?: {
    engine?: string;
    displacement?: string;
    fuelSystem?: string;
    transmission?: string;
    brakes?: string;
    tires?: string;
  };
  stockInfo?: {
    totalStock: number;
    availableColors: number;
    isAvailable: boolean;
  };
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onAddToWishlist: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart, onAddToWishlist }: ProductCardProps) {
  const { getAvailableColors, getStockLevel, getActivePromos, lastUpdate, inventory } = useInventory();
  const [showSpecs, setShowSpecs] = useState(false);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0]?.name || '');
  const [flashUpdate, setFlashUpdate] = useState(false);
  
  const availableColors = getAvailableColors(product.id);
  const stockLevel = getStockLevel(product.id, selectedColor);
  const activePromos = getActivePromos(product.id);
  
  // Check both quantity AND isAvailable flag for the selected color
  const selectedItem = inventory.find(item => item.modelId === product.id && item.colorName === selectedColor);
  const isInStock = selectedItem ? (selectedItem.quantity > 0 && selectedItem.isAvailable) : false;
  const isLowStock = isInStock && stockLevel <= 3;

  // Flash animation when data updates
  useEffect(() => {
    if (lastUpdate) {
      setFlashUpdate(true);
      const timer = setTimeout(() => setFlashUpdate(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [lastUpdate, stockLevel, availableColors.length]);
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="text-yellow-400">★</span>);
    }
    
    if (hasHalfStar) {
      stars.push(<span key="half" className="text-yellow-400">☆</span>);
    }
    
    const remainingStars = 5 - stars.length;
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<span key={`empty-${i}`} className="text-gray-300">☆</span>);
    }
    
    return stars;
  };

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <>
      <div className="bg-white border border-gray-200 hover:shadow-xl transition-all duration-300 group hover:border-red-300 relative overflow-hidden">
        {/* Honda-style header */}
        <div className="bg-gray-50 border-b border-gray-200 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xs">H</span>
              </div>
              <span className="text-sm text-gray-600 font-medium">{product.category}</span>
            </div>
            {product.isOnSale && (
              <div className="bg-red-600 text-white text-xs px-2 py-1 rounded font-bold">
                PROMO
              </div>
            )}
          </div>
        </div>

        {/* Product Image Area */}
        <div className="relative bg-white aspect-[4/3] overflow-hidden">
          {/* Real-time Stock Status Badge */}
          <div className="absolute top-2 left-2 z-10">
            {!selectedItem?.isAvailable ? (
              <span className="bg-gray-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                🚫 UNAVAILABLE
              </span>
            ) : stockLevel === 0 ? (
              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-bounce">
                ❌ OUT OF STOCK
              </span>
            ) : isLowStock ? (
              <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                ⚠️ LOW STOCK ({stockLevel})
              </span>
            ) : (
              <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                ✅ IN STOCK ({stockLevel})
              </span>
            )}
          </div>

          {/* Real-time Promo Badge */}
          {activePromos.length > 0 && (
            <div className="absolute top-2 right-2 z-10">
              <span className="bg-gradient-to-r from-yellow-400 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-bounce">
                🔥 LIVE PROMO!
              </span>
            </div>
          )}

          {/* Live Update Indicator */}
          {flashUpdate && (
            <div className="absolute bottom-2 left-2 z-10 bg-blue-500 text-white px-2 py-1 rounded text-xs animate-pulse">
              📡 UPDATED
            </div>
          )}

          {/* Motorcycle image */}
          {product.image ? (
            <img 
              src={product.image} 
              alt={product.name}
              className={`w-full h-full object-contain bg-white p-4 group-hover:scale-105 transition-transform duration-300 ${
                !isInStock ? 'grayscale opacity-50' : ''
              } ${flashUpdate ? 'scale-105' : ''}`}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
                (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <div className={`w-full h-full flex items-center justify-center text-6xl text-gray-400 ${product.image ? 'hidden' : ''}`}>
            🏍️
          </div>

          {/* Hover Action - Wishlist only */}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={() => onAddToWishlist(product)}
              className="bg-white hover:bg-red-50 p-2 rounded-full shadow-lg hover:text-red-600 transition-colors border border-gray-200"
              title="Add to Wishlist"
            >
              ❤️
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">        
          <h3 className="text-lg font-semibold text-gray-800 mb-2 hover:text-red-600 cursor-pointer transition-colors leading-tight min-h-[3rem] flex items-center">
            {product.name}
          </h3>
          
          <p className="text-xs text-gray-500 mb-3">
            Suggested Retail Price may vary depending on your location.
          </p>
          
          {/* Real-time Color Selection - Only Available Colors */}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-4">
              <div className="text-sm font-medium text-gray-700 mb-2 flex items-center justify-between">
                <span>Available Colors ({availableColors.length}):</span>
                {flashUpdate && (
                  <span className="text-xs text-blue-600 animate-pulse">🔄 Updated</span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {product.colors?.filter(color => availableColors.includes(color.name)).map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                      selectedColor === color.name 
                        ? 'border-red-600 scale-110 shadow-lg ring-2 ring-red-200' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={`${color.name} - ${getStockLevel(product.id, color.name)} in stock`}
                  >
                    {selectedColor === color.name && (
                      <span className="text-white text-xs flex items-center justify-center h-full font-bold">✓</span>
                    )}
                  </button>
                )) || (
                  <span className="text-red-400 text-sm animate-pulse">❌ No colors available</span>
                )}
              </div>
              {selectedColor && (
                <div className="text-xs text-gray-500 mt-1">
                  {selectedColor} - {getStockLevel(product.id, selectedColor)} available
                </div>
              )}
            </div>
          )}

          {/* Real-time Active Promos Display */}
          {activePromos.map(promo => (
            <div key={promo.id} className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg p-3 mb-3 animate-pulse">
              <p className="text-sm font-bold text-red-700 flex items-center">
                🔥 {promo.title}
              </p>
              <p className="text-xs text-red-600 mb-2">{promo.description}</p>
              <div className="flex flex-wrap gap-1">
                {promo.freebies.map(freebie => (
                  <span key={freebie} className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-medium">
                    🎁 {freebie}
                  </span>
                ))}
              </div>
            </div>
          ))}

          {/* Price - Honda Style */}
          <div className="mb-4 bg-gray-50 p-3 border-l-4 border-red-600">
            <div className="text-xs text-gray-600 mb-1">SRP:</div>
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold text-red-600">
                ₱ {product.price.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              {activePromos.length > 0 && (
                <span className="text-sm text-green-600 font-bold animate-pulse">
                  + FREE Gifts! 🎁
                </span>
              )}
            </div>
          </div>
          
          {/* Real-time Action Button */}
          <div className="flex gap-2">
            <button 
              onClick={() => setShowSpecs(true)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 font-medium transition-colors text-sm tracking-wide border border-blue-600 hover:border-blue-700"
            >
              VIEW FULL SPECS
            </button>
            <button
              onClick={() => onAddToCart(product)}
              disabled={!isInStock}
              className={`flex-1 py-3 px-4 font-bold transition-all duration-200 text-sm ${
                isInStock
                  ? 'bg-red-600 text-white hover:bg-red-700 hover:scale-105 active:scale-95'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {!selectedItem?.isAvailable ? (
                '🚫 UNAVAILABLE'
              ) : stockLevel === 0 ? (
                '❌ OUT OF STOCK'
              ) : (
                <>
                  🏍️ INQUIRE NOW
                  {isLowStock && <span className="ml-1 animate-pulse">⚡</span>}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Specifications Modal */}
      {showSpecs && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
            {/* Honda-style modal header */}
            <div className="bg-red-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <span className="text-red-600 font-bold">H</span>
                </div>
                <h2 className="text-xl font-bold">{product.name}</h2>
              </div>
              <button 
                onClick={() => setShowSpecs(false)}
                className="text-white hover:bg-red-700 p-2 rounded transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              {/* Product Image */}
              <div className="bg-gray-50 p-6 mb-6 text-center border">
                {product.image ? (
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="max-w-full h-48 mx-auto object-contain"
                  />
                ) : (
                  <div className="text-6xl text-gray-400">🏍️</div>
                )}
              </div>

              {/* Color Selection in Modal */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <span className="text-red-600">🎨</span>
                    Available Colors
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {product.colors?.filter(color => availableColors.includes(color.name)).map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color.name)}
                        className={`p-3 border rounded-lg transition-all duration-200 ${
                          selectedColor === color.name 
                            ? 'border-red-600 bg-red-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full border-2 ${
                              selectedColor === color.name ? 'border-red-600' : 'border-gray-300'
                            }`}
                            style={{ backgroundColor: color.hex }}
                          >
                            {selectedColor === color.name && (
                              <span className="text-white text-xs flex items-center justify-center h-full font-bold">✓</span>
                            )}
                          </div>
                          <div className="text-left">
                            <div className="text-sm font-medium text-gray-700">{color.name}</div>
                            <div className="text-xs text-gray-500">
                              {getStockLevel(product.id, color.name)} in stock
                            </div>
                          </div>
                        </div>
                      </button>
                    )) || (
                      <div className="col-span-full text-center py-4">
                        <span className="text-red-400">❌ No colors currently available</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Price */}
              <div className="bg-red-50 border-l-4 border-red-600 p-4 mb-6">
                <div className="text-sm text-gray-600">Suggested Retail Price</div>
                <div className="text-2xl font-bold text-red-600">
                  ₱ {product.price.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  *Price may vary depending on your location
                </div>
              </div>

              {/* Specifications */}
              {product.specifications && (
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="text-red-600">⚙️</span>
                    Technical Specifications
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="border border-gray-200 p-3">
                        <div className="text-sm font-semibold text-gray-700 capitalize mb-1">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </div>
                        <div className="text-gray-800">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-3 mt-6 pt-6 border-t">
                <button 
                  onClick={() => {
                    setShowSpecs(false);
                    onAddToCart(product);
                  }}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-4 font-medium transition-colors"
                >
                  INQUIRE NOW
                </button>
                <button 
                  onClick={() => setShowSpecs(false)}
                  className="px-6 py-3 border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export type { ProductCardProps };