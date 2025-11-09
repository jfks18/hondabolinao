'use client';

import { useState } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import ProductGrid from './components/ProductGrid';
import Footer from './components/Footer';
import { CartProvider } from './components/CartContext';
import { Product } from './components/ProductCard';

export default function Home() {
  const [wishlist, setWishlist] = useState<Product[]>([]);

  const handleAddToWishlist = (product: Product) => {
    if (!wishlist.find(item => item.id === product.id)) {
      setWishlist(prev => [...prev, product]);
      console.log('Added to wishlist:', product.name);
    }
  };

  return (
    <CartProvider>
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-red-25 relative overflow-hidden">
        {/* Guanzon Honda 3S Background Pattern */}
        <div className="fixed inset-0 pointer-events-none opacity-5 z-0">
          {/* Guanzon Logo Pattern */}
          <div className="absolute top-20 right-20 text-8xl font-bold text-red-600 transform rotate-12 select-none">G</div>
          <div className="absolute bottom-40 left-20 text-6xl font-bold text-gray-600 transform -rotate-12 select-none">3S</div>
          <div className="absolute top-1/2 left-1/4 text-4xl font-bold text-red-600 opacity-50 select-none">HONDA</div>
          
          {/* 3S Service Icons Pattern */}
          <div className="absolute top-32 left-1/3 text-4xl transform rotate-45">🏪</div>
          <div className="absolute bottom-1/3 right-1/4 text-4xl transform -rotate-12">🔧</div>
          <div className="absolute top-2/3 left-1/6 text-4xl transform rotate-12">⚙️</div>
          
          {/* Geometric Pattern */}
          <div className="absolute top-1/4 right-1/3 w-32 h-32 border-2 border-red-600 rounded-full opacity-20"></div>
          <div className="absolute bottom-1/4 left-1/3 w-24 h-24 border-2 border-gray-400 rounded-full opacity-20"></div>
          
          {/* Honda Wing Shapes */}
          <div className="absolute top-1/3 right-1/6">
            <div className="w-16 h-6 bg-red-600 rounded-full transform rotate-12 opacity-20"></div>
            <div className="w-12 h-4 bg-red-600 rounded-full transform -rotate-12 opacity-20 mt-1 ml-3"></div>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10">
          <Header />
          <main>
            <HeroSection />
            <ProductGrid 
              onAddToWishlist={handleAddToWishlist}
            />
          </main>
          <Footer />
        </div>
      </div>
    </CartProvider>
  );
}
