export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Honda Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-red-50">
        {/* Subtle Honda Wing Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-32 h-32 border-2 border-red-600 rounded-full transform rotate-12"></div>
          <div className="absolute top-32 right-20 w-24 h-24 border-2 border-red-600 rounded-full transform -rotate-45"></div>
          <div className="absolute bottom-20 left-1/4 w-40 h-40 border-2 border-red-600 rounded-full transform rotate-45"></div>
          <div className="absolute bottom-40 right-10 w-28 h-28 border-2 border-red-600 rounded-full transform -rotate-12"></div>
          {/* Honda Wing Shapes */}
          <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2">
            <div className="w-20 h-8 bg-red-600 rounded-full transform rotate-12 opacity-20"></div>
            <div className="w-16 h-6 bg-red-600 rounded-full transform -rotate-12 opacity-20 mt-2 ml-4"></div>
          </div>
        </div>
      </div>

      {/* Perfect Circular Infinite Carousel - No Flicker */}
      <div className="relative w-full bg-gradient-to-r from-white via-gray-50 to-white py-16 overflow-hidden">
        {/* Honda Header */}
        <div className="container mx-auto px-4 mb-12">
          <div className="text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-2xl">H</span>
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                  HONDA <span className="text-red-600">BESTSELLERS</span>
                </h2>
              </div>
            </div>
          </div>
        </div>
        
        {/* Circular Infinite Loop Container */}
        <div className="carousel-wrapper">
          <div className="circular-infinite-scroll">
            {/* First set of Honda cards */}
            <div className="carousel-card bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
              <div className="relative">
                <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 text-center">
                  <span className="text-2xl">🥇</span>
                  <h3 className="font-bold text-lg mt-2">Honda BeAT</h3>
                  <p className="text-sm opacity-90">#1 Bestseller</p>
                </div>
                <div className="p-6">
                  <div className="bg-gray-50 rounded-lg p-4 mb-4 flex items-center justify-center h-32">
                    <img 
                      src="https://cms.hondaph.com/images/products/689d3f4dd42e8.png" 
                      alt="Honda BeAT" 
                      className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600 text-sm mb-2">Philippines' Top Scooter</p>
                    <div className="text-2xl font-bold text-red-600">₱72,400</div>
                    <p className="text-xs text-gray-500">Starting price</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="carousel-card bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
              <div className="relative">
                <div className="bg-gradient-to-r from-gray-600 to-gray-700 text-white p-4 text-center">
                  <span className="text-2xl">🥈</span>
                  <h3 className="font-bold text-lg mt-2">Honda CLICK125</h3>
                  <p className="text-sm opacity-90">#2 Premium</p>
                </div>
                <div className="p-6">
                  <div className="bg-gray-50 rounded-lg p-4 mb-4 flex items-center justify-center h-32">
                    <img 
                      src="https://cms.hondaph.com/images/products/680623a88004a.png" 
                      alt="Honda CLICK125" 
                      className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600 text-sm mb-2">Smart AT Scooter</p>
                    <div className="text-2xl font-bold text-red-600">₱81,900</div>
                    <p className="text-xs text-gray-500">Starting price</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="carousel-card bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
              <div className="relative">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 text-center">
                  <span className="text-2xl">🥉</span>
                  <h3 className="font-bold text-lg mt-2">Honda Wave RSX</h3>
                  <p className="text-sm opacity-90">#3 Champion</p>
                </div>
                <div className="p-6">
                  <div className="bg-gray-50 rounded-lg p-4 mb-4 flex items-center justify-center h-32">
                    <img 
                      src="https://cms.hondaph.com/images/products/65a9dbdb95398.png" 
                      alt="Honda Wave RSX" 
                      className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600 text-sm mb-2">Underbone Leader</p>
                    <div className="text-2xl font-bold text-red-600">₱62,900</div>
                    <p className="text-xs text-gray-500">Starting price</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="carousel-card bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group border-2 border-yellow-400">
              <div className="relative">
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-4 text-center relative">
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                    PROMO!
                  </div>
                  <span className="text-2xl">🏆</span>
                  <h3 className="font-bold text-lg mt-2">Honda Winner X</h3>
                  <p className="text-sm opacity-90">Special Offer</p>
                </div>
                <div className="p-6">
                  <div className="bg-white rounded-lg p-4 mb-4 flex items-center justify-center border border-yellow-200 h-32">
                    <img 
                      src="https://cms.hondaph.com/images/products/65add5514243d.png" 
                      alt="Honda Winner X" 
                      className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="text-center">
                    <div className="bg-yellow-200 text-yellow-800 text-xs px-3 py-1 rounded-full inline-block mb-2">
                      🎁 FREE Registration + Rice Cooker
                    </div>
                    <div className="text-2xl font-bold text-orange-600">₱123,900</div>
                    <p className="text-xs text-gray-600">+ Amazing Freebies!</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="carousel-card bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
              <div className="relative">
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 text-center">
                  <span className="text-2xl">⭐</span>
                  <h3 className="font-bold text-lg mt-2">Honda PCX160</h3>
                  <p className="text-sm opacity-90">Premium King</p>
                </div>
                <div className="p-6">
                  <div className="bg-gray-50 rounded-lg p-4 mb-4 flex items-center justify-center h-32">
                    <img 
                      src="https://cms.hondaph.com/images/products/681892ec564cb.png" 
                      alt="Honda PCX160" 
                      className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600 text-sm mb-2">Premium Scooter</p>
                    <div className="text-2xl font-bold text-red-600">₱133,400</div>
                    <p className="text-xs text-gray-500">Starting price</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Duplicate set for seamless circular loop - EXACT COPIES */}
            <div className="carousel-card bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
              <div className="relative">
                <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 text-center">
                  <span className="text-2xl">🥇</span>
                  <h3 className="font-bold text-lg mt-2">Honda BeAT</h3>
                  <p className="text-sm opacity-90">#1 Bestseller</p>
                </div>
                <div className="p-6">
                  <div className="bg-gray-50 rounded-lg p-4 mb-4 flex items-center justify-center h-32">
                    <img 
                      src="https://cms.hondaph.com/images/products/689d3f4dd42e8.png" 
                      alt="Honda BeAT" 
                      className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600 text-sm mb-2">Philippines' Top Scooter</p>
                    <div className="text-2xl font-bold text-red-600">₱72,400</div>
                    <p className="text-xs text-gray-500">Starting price</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="carousel-card bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
              <div className="relative">
                <div className="bg-gradient-to-r from-gray-600 to-gray-700 text-white p-4 text-center">
                  <span className="text-2xl">🥈</span>
                  <h3 className="font-bold text-lg mt-2">Honda CLICK125</h3>
                  <p className="text-sm opacity-90">#2 Premium</p>
                </div>
                <div className="p-6">
                  <div className="bg-gray-50 rounded-lg p-4 mb-4 flex items-center justify-center h-32">
                    <img 
                      src="https://cms.hondaph.com/images/products/680623a88004a.png" 
                      alt="Honda CLICK125" 
                      className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600 text-sm mb-2">Smart AT Scooter</p>
                    <div className="text-2xl font-bold text-red-600">₱81,900</div>
                    <p className="text-xs text-gray-500">Starting price</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="carousel-card bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
              <div className="relative">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 text-center">
                  <span className="text-2xl">🥉</span>
                  <h3 className="font-bold text-lg mt-2">Honda Wave RSX</h3>
                  <p className="text-sm opacity-90">#3 Champion</p>
                </div>
                <div className="p-6">
                  <div className="bg-gray-50 rounded-lg p-4 mb-4 flex items-center justify-center h-32">
                    <img 
                      src="https://cms.hondaph.com/images/products/65a9dbdb95398.png" 
                      alt="Honda Wave RSX" 
                      className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600 text-sm mb-2">Underbone Leader</p>
                    <div className="text-2xl font-bold text-red-600">₱62,900</div>
                    <p className="text-xs text-gray-500">Starting price</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="carousel-card bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group border-2 border-yellow-400">
              <div className="relative">
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-4 text-center relative">
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                    PROMO!
                  </div>
                  <span className="text-2xl">🏆</span>
                  <h3 className="font-bold text-lg mt-2">Honda Winner X</h3>
                  <p className="text-sm opacity-90">Special Offer</p>
                </div>
                <div className="p-6">
                  <div className="bg-white rounded-lg p-4 mb-4 flex items-center justify-center border border-yellow-200 h-32">
                    <img 
                      src="https://cms.hondaph.com/images/products/65add5514243d.png" 
                      alt="Honda Winner X" 
                      className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="text-center">
                    <div className="bg-yellow-200 text-yellow-800 text-xs px-3 py-1 rounded-full inline-block mb-2">
                      🎁 FREE Registration + Rice Cooker
                    </div>
                    <div className="text-2xl font-bold text-orange-600">₱123,900</div>
                    <p className="text-xs text-gray-600">+ Amazing Freebies!</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="carousel-card bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
              <div className="relative">
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 text-center">
                  <span className="text-2xl">⭐</span>
                  <h3 className="font-bold text-lg mt-2">Honda PCX160</h3>
                  <p className="text-sm opacity-90">Premium King</p>
                </div>
                <div className="p-6">
                  <div className="bg-gray-50 rounded-lg p-4 mb-4 flex items-center justify-center h-32">
                    <img 
                      src="https://cms.hondaph.com/images/products/681892ec564cb.png" 
                      alt="Honda PCX160" 
                      className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600 text-sm mb-2">Premium Scooter</p>
                    <div className="text-2xl font-bold text-red-600">₱133,400</div>
                    <p className="text-xs text-gray-500">Starting price</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Promo Section */}
      <div className="relative bg-gradient-to-br from-gray-50 via-red-25 to-white py-16 overflow-hidden">
        {/* Guanzon Honda 3S Background Elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/4 left-1/4 w-64 h-32 bg-red-600 rounded-full blur-3xl transform rotate-45"></div>
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-red-600 rounded-full blur-3xl transform -rotate-12"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="text-6xl font-bold text-red-600 opacity-10 select-none">GUANZON</div>
            <div className="text-4xl font-bold text-gray-600 opacity-10 select-none mt-2">HONDA 3S</div>
          </div>
          {/* 3S Icons */}
          <div className="absolute top-20 right-20 text-4xl opacity-20">🏪</div>
          <div className="absolute bottom-32 left-20 text-4xl opacity-20">🔧</div>
          <div className="absolute top-40 left-1/3 text-4xl opacity-20">⚙️</div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Promo Header */}
          <div className="text-center mb-12 transform transition-all duration-1000 hover:scale-105">
            <div className="inline-block bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-4 rounded-full mb-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
              <h2 className="text-2xl md:text-3xl font-bold tracking-wide">
                🔥 GUANZON HONDA 3S EXCLUSIVE PROMOS
              </h2>
            </div>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
              <span className="font-semibold text-red-600">Sales • Service • Spare Parts</span> - Your trusted Honda 3S dealer in Bolinao!
              <br />Limited time offers and special deals on Honda motorcycles, maintenance, and genuine parts.
            </p>
            
            {/* Promo Duration Highlight */}
            <div className="mt-4 bg-gradient-to-r from-red-600 to-orange-600 text-white px-6 py-3 rounded-full inline-block shadow-lg">
              <div className="flex items-center gap-3 text-sm font-semibold">
                <span className="text-xl animate-pulse">⏰</span>
                <span>HONDA WINNER X PROMO PERIOD</span>
                <span className="bg-white/20 px-3 py-1 rounded-full text-xs">
                  NOV 3 - DEC 31, 2025
                </span>
                <span className="text-xl animate-pulse">🏆</span>
              </div>
            </div>
            
            <div className="flex justify-center items-center gap-6 mt-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span className="text-red-600 text-lg">🏪</span>
                <span className="font-medium">SALES</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-red-600 text-lg">🔧</span>
                <span className="font-medium">SERVICE</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-red-600 text-lg">⚙️</span>
                <span className="font-medium">SPARE PARTS</span>
              </div>
            </div>
          </div>

          {/* Promo Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            
            {/* Promo 1 - Honda Winner X Special */}
            <div className="group bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transform hover:scale-110 hover:-translate-y-4 transition-all duration-700 ease-out relative border-2 border-yellow-400">
              <div className="bg-gradient-to-br from-yellow-500 via-orange-500 to-red-600 text-white p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full transition-transform duration-1000"></div>
                <div className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-red-700 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-bounce">
                  WINNER PROMO
                </div>
                <div className="text-5xl mb-3 transform group-hover:scale-125 transition-all duration-500">🏆</div>
                <h3 className="text-xl font-bold mb-2 tracking-wide">Honda Winner X Special</h3>
                <p className="text-yellow-100 font-medium">All Variants Available!</p>
              </div>
              <div className="p-6">
                <div className="text-center mb-4">
                  <div className="text-2xl font-bold text-orange-600 mb-1">FREE</div>
                  <div className="text-sm text-gray-600">Registration + Rice Cooker</div>
                </div>
                <ul className="text-sm text-gray-600 mb-4 space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    <span>All Honda Winner X variants</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">🎁</span>
                    <span><strong>FREE</strong> LTO Registration</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">🍚</span>
                    <span><strong>FREE</strong> Xtreme Rice Cooker</span>
                  </li>
                  <li className="flex items-center gap-2 text-xs text-orange-600 font-semibold bg-orange-50 px-2 py-1 rounded">
                    <span className="text-orange-600">📅</span>
                    <span>Nov 3 - Dec 31, 2025</span>
                  </li>
                </ul>
                <button className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-400 hover:to-orange-500 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl">
                  Get Winner X Now!
                </button>
              </div>
            </div>

            {/* Promo 2 - Service & Maintenance */}
            <div className="group bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transform hover:scale-110 hover:-translate-y-4 transition-all duration-700 ease-out relative border border-blue-100">
              <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 text-white p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:translate-x-full transition-transform duration-1000"></div>
                <div className="absolute top-3 right-3 bg-gradient-to-r from-green-400 to-green-500 text-blue-800 text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  3S SERVICE
                </div>
                <div className="text-5xl mb-3 transform group-hover:scale-125 transition-all duration-500">🔧</div>
                <h3 className="text-xl font-bold mb-2 tracking-wide">Expert Honda Service</h3>
                <p className="text-blue-100 font-medium">Certified Technicians</p>
              </div>
              <div className="p-6">
                <div className="text-center mb-4">
                  <div className="text-2xl font-bold text-blue-600 mb-1">QUALITY</div>
                  <div className="text-sm text-gray-600">Service & Maintenance</div>
                </div>
                <ul className="text-sm text-gray-600 mb-4 space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Certified Honda technicians</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">🔧</span>
                    <span>Genuine Honda parts only</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">⚡</span>
                    <span>Quick turnaround time</span>
                  </li>
                </ul>
                <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl">
                  Book Service
                </button>
              </div>
            </div>

            {/* Promo 3 - Genuine Parts */}
            <div className="group bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transform hover:scale-110 hover:-translate-y-4 transition-all duration-700 ease-out relative border border-gray-100">
              <div className="bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800 text-white p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:translate-x-full transition-transform duration-1000"></div>
                <div className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  AUTHENTIC
                </div>
                <div className="text-5xl mb-3 transform group-hover:scale-125 transition-all duration-500">⚙️</div>
                <h3 className="text-xl font-bold mb-2 tracking-wide">Genuine Honda Parts</h3>
                <p className="text-gray-100 font-medium">100% Authentic</p>
              </div>
              <div className="p-6">
                <div className="text-center mb-4">
                  <div className="text-2xl font-bold text-gray-700 mb-1">ORIGINAL</div>
                  <div className="text-sm text-gray-600">Honda Components</div>
                </div>
                <ul className="text-sm text-gray-600 mb-4 space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Factory-original quality</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">⚡</span>
                    <span>Fast parts delivery</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">🔧</span>
                    <span>Expert installation service</span>
                  </li>
                </ul>
                <button className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl">
                  Shop Parts
                </button>
              </div>
            </div>

          </div>

          {/* Promo Banner */}
          <div className="relative bg-gradient-to-br from-red-600 via-red-700 to-red-900 rounded-3xl p-8 md:p-16 text-white text-center overflow-hidden shadow-2xl transform transition-all duration-1000 hover:scale-105">
            {/* Animated Background Elements */}
            <div className="absolute inset-0">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-red-500/20 via-transparent to-red-900/20"></div>
              <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
              <div className="absolute bottom-10 right-10 w-40 h-40 bg-yellow-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
            </div>
            
            {/* Honda Wing Pattern Overlay */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-1/4 left-1/4 transform -rotate-12">
                <div className="w-16 h-6 bg-white rounded-full"></div>
                <div className="w-12 h-4 bg-white rounded-full ml-4 mt-1"></div>
              </div>
              <div className="absolute bottom-1/4 right-1/4 transform rotate-12">
                <div className="w-16 h-6 bg-white rounded-full"></div>
                <div className="w-12 h-4 bg-white rounded-full ml-4 mt-1"></div>
              </div>
            </div>
            
            <div className="relative z-10">
              <div className="text-6xl md:text-7xl mb-6 animate-bounce">🎉</div>
              <h3 className="text-3xl md:text-5xl font-bold mb-6 tracking-wider transform transition-all duration-500 hover:scale-110">
                <span className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 bg-clip-text text-transparent">
                  HONDA WINNER X
                </span>
                <br />
                <span className="text-2xl md:text-3xl text-white/90">MEGA PROMO 2025</span>
              </h3>
              <p className="text-lg md:text-xl mb-8 opacity-95 max-w-3xl mx-auto leading-relaxed font-light">
                🏆 <span className="font-bold text-yellow-300">ALL HONDA WINNER X VARIANTS</span> now come with amazing freebies! 
                <br className="hidden md:block" />
                Get your dream motorcycle with <span className="font-semibold text-yellow-300">FREE Registration & Xtreme Rice Cooker!</span>
              </p>
              <div className="flex flex-col md:flex-row gap-6 justify-center items-center mb-8">
                <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 text-center border border-white/30 transform transition-all duration-500 hover:scale-110 hover:bg-white/30 shadow-2xl">
                  <div className="text-xl font-bold text-yellow-300">🏍️ HONDA</div>
                  <div className="text-3xl font-bold text-yellow-400 my-2 animate-pulse">WINNER X</div>
                  <div className="text-sm opacity-90 font-semibold">ALL VARIANTS</div>
                </div>
                <div className="text-4xl font-bold text-yellow-400 animate-pulse">+</div>
                <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 text-center border border-white/30 transform transition-all duration-500 hover:scale-110 hover:bg-white/30 shadow-2xl">
                  <div className="text-xl font-bold text-yellow-300">📋 FREE</div>
                  <div className="text-2xl font-bold text-yellow-400 my-2">REGISTRATION</div>
                  <div className="text-sm opacity-90 font-semibold">LTO COMPLETE</div>
                </div>
                <div className="text-4xl font-bold text-yellow-400 animate-pulse">+</div>
                <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 text-center border border-white/30 transform transition-all duration-500 hover:scale-110 hover:bg-white/30 shadow-2xl">
                  <div className="text-xl font-bold text-yellow-300">🍚 FREE</div>
                  <div className="text-2xl font-bold text-yellow-400 my-2">RICE COOKER</div>
                  <div className="text-sm opacity-90 font-semibold">XTREME BRAND</div>
                </div>
              </div>
              <button className="group relative bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 hover:from-yellow-300 hover:via-orange-400 hover:to-red-500 text-white font-bold py-5 px-12 rounded-2xl text-xl transition-all duration-500 transform hover:scale-110 hover:-translate-y-2 shadow-2xl hover:shadow-orange-400/50 border-2 border-yellow-300">
                <span className="relative z-10 flex items-center justify-center gap-3">
                  <span className="text-2xl group-hover:animate-bounce">🏆</span>
                  GET HONDA WINNER X NOW!
                  <span className="text-2xl group-hover:animate-bounce">🍚</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-2xl"></div>
              </button>
              <div className="mt-6 space-y-2">
                <div className="bg-black/30 backdrop-blur-sm rounded-lg px-6 py-3 inline-block">
                  <p className="text-yellow-300 font-bold text-sm">
                    🎯 EXCLUSIVE Honda Winner X Promo - All Variants Available!
                  </p>
                  <p className="text-white/80 text-xs">
                    *FREE Registration + Xtreme Rice Cooker. Promo period: November 3 - December 31, 2025. While stocks last.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}