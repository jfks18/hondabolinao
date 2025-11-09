'use client';

import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md relative z-50">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm text-white">
          <div className="flex gap-4">
            <span>✉️ guanzon.hondabolinao@gmail.com</span>
            <span>📞 (075) 554-9876</span>
          </div>
          <div className="flex gap-4">
            <span className="font-semibold bg-white/20 px-3 py-1 rounded-full">Honda 3S Authorized Dealer</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-red-600">GUANZON</h1>
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-gray-800">HONDA</span>
                <span className="bg-red-600 text-white text-xs px-2 py-1 rounded font-bold">3S</span>
              </div>
            </div>
            <div className="border-l-2 border-gray-300 pl-4">
              <div className="text-sm text-gray-600">Bolinao Branch</div>
              <div className="text-xs text-red-600 font-medium">Sales • Service • Spare Parts</div>
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* Hero Image Section */}
      <div className="relative w-full overflow-hidden">
        <img 
          src="/assets/images/hondabranh.jpg" 
          alt="Honda Bolinao Branch" 
          className="w-full h-[50vh] md:h-[60vh] lg:h-[70vh] object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
        <div className="absolute inset-0 flex items-center justify-center text-center text-white px-4">
          <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-6 md:p-12 max-w-4xl mx-auto border border-white/20">
            <div className="mb-4">
              <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-2 drop-shadow-2xl">GUANZON</h2>
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-2 text-red-400">HONDA 3S SHOP</h3>
            </div>
            <p className="text-lg md:text-xl lg:text-2xl font-light opacity-95 mb-4">Bolinao Branch - Your Trusted Honda Partner</p>
            <div className="flex justify-center items-center gap-8 text-sm md:text-base">
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                <span className="text-xl">🏪</span>
                <span className="font-medium">SALES</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                <span className="text-xl">🔧</span>
                <span className="font-medium">SERVICE</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                <span className="text-xl">⚙️</span>
                <span className="font-medium">SPARE PARTS</span>
              </div>
            </div>
          </div>
        </div>
      </div>



      {/* Animated Banner Cards */}
      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1 - Sales */}
            <div className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-500 cursor-pointer">
              <div className="h-52 bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center relative">
                <div className="text-white text-center z-10">
                  <div className="text-6xl mb-3 group-hover:scale-110 transition-transform duration-300">�</div>
                  <h3 className="text-2xl font-bold mb-2">SALES</h3>
                  <p className="text-sm opacity-90 mb-2">Honda Motorcycles & Scooters</p>
                  <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold">
                    Authorized Dealer
                  </div>
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
            </div>

            {/* Card 2 - Service */}
            <div className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-500 cursor-pointer">
              <div className="h-52 bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center relative">
                <div className="text-white text-center z-10">
                  <div className="text-6xl mb-3 group-hover:scale-110 transition-transform duration-300">🔧</div>
                  <h3 className="text-2xl font-bold mb-2">SERVICE</h3>
                  <p className="text-sm opacity-90 mb-2">Expert Maintenance & Repair</p>
                  <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold">
                    Certified Technicians
                  </div>
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-green-400 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
            </div>

            {/* Card 3 - Spare Parts */}
            <div className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-500 cursor-pointer">
              <div className="h-52 bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center relative">
                <div className="text-white text-center z-10">
                  <div className="text-6xl mb-3 group-hover:scale-110 transition-transform duration-300">⚙️</div>
                  <h3 className="text-2xl font-bold mb-2">SPARE PARTS</h3>
                  <p className="text-sm opacity-90 mb-2">Genuine Honda Components</p>
                  <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold">
                    100% Authentic
                  </div>
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-400 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
            </div>

          </div>
        </div>
      </div>
    </header>
  );
}