'use client';

import { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Newsletter signup logic would go here
    console.log('Newsletter signup:', email);
    setEmail('');
    alert('Thank you for subscribing to our newsletter!');
  };

  return (
    <footer className="bg-gray-800 text-white">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-2xl font-bold mb-2">Stay Updated with Guanzon Honda 3S</h3>
              <p className="text-red-100">Get the latest Honda news, promos, and service updates</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="mb-4">
              <h3 className="text-2xl font-bold text-red-400 mb-1">GUANZON</h3>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg font-semibold">HONDA 3S SHOP</span>
                <span className="bg-red-600 text-white text-xs px-2 py-1 rounded font-bold">3S</span>
              </div>
              <p className="text-sm text-gray-400">Bolinao Branch - Authorized Dealer</p>
            </div>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Your trusted Honda 3S partner in Bolinao. We provide complete 
              <span className="text-red-400 font-semibold"> Sales, Service & Spare Parts</span> solutions 
              for all Honda motorcycles with genuine care and expertise.
            </p>
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-3 text-sm">
                <span className="text-red-400">🏪</span>
                <span className="text-gray-300">Honda Motorcycle Sales</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-red-400">🔧</span>
                <span className="text-gray-300">Expert Service & Maintenance</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-red-400">⚙️</span>
                <span className="text-gray-300">Genuine Honda Spare Parts</span>
              </div>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-red-400 text-2xl transition-colors">📘</a>
              <a href="#" className="text-gray-300 hover:text-red-400 text-2xl transition-colors">📷</a>
              <a href="#" className="text-gray-300 hover:text-red-400 text-2xl transition-colors">🐦</a>
              <a href="#" className="text-gray-300 hover:text-red-400 text-2xl transition-colors">📺</a>
            </div>
          </div>

          {/* Honda Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-red-400">Honda Services</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-red-400 transition-colors">🏍️ Motorcycle Sales</a></li>
              <li><a href="#" className="text-gray-300 hover:text-red-400 transition-colors">🔧 Periodic Maintenance</a></li>
              <li><a href="#" className="text-gray-300 hover:text-red-400 transition-colors">⚙️ Engine Repair</a></li>
              <li><a href="#" className="text-gray-300 hover:text-red-400 transition-colors">🛠️ Parts & Accessories</a></li>
              <li><a href="#" className="text-gray-300 hover:text-red-400 transition-colors">💡 Technical Support</a></li>
              <li><a href="#" className="text-gray-300 hover:text-red-400 transition-colors">📋 Warranty Claims</a></li>
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-red-400">Customer Support</h4>
            <ul className="space-y-2">
              <li><a href="https://www.facebook.com/motorcentrumbolinao.guanzon" className="text-gray-300 hover:text-red-400 transition-colors">📞 Contact Us</a></li>
              <li><a href="#" className="text-gray-300 hover:text-red-400 transition-colors">🛡️ Honda Warranty</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-red-400">Visit Our Shop</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-red-400">📍</span>
                <div>
                  <p className="text-white font-semibold">Guanzon Honda 3S Shop</p>
                  <p className="text-gray-300">415 A.Ponce Corner T.Celi St.Germinal Bolinao</p>
                  <p className="text-gray-300">Pangasinan, Philippines 2406</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-red-400">📞</span>
                <div>
                  <p className="text-gray-300">Smart: 09178190155</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-red-400">✉️</span>
                <p className="text-gray-300">mcc_bolinao@guanzongroup.com.ph</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-red-400">🕒</span>
                <div>
                  <p className="text-gray-300">Mon-Sat: 8:30AM-5:30PM</p>
                  <p className="text-gray-300">Sunday: CLOSE</p>
                </div>
              </div>
              <div className="mt-4 p-3 bg-red-900/30 rounded-lg border-l-4 border-red-500">
                <p className="text-red-300 text-sm font-semibold">
                  🏆 Honda 3S Authorized Dealer
                </p>
                <p className="text-gray-400 text-xs">
                  Licensed & Certified by Honda Philippines
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-700 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-300 text-sm mb-4 md:mb-0">
              © 2024 Guanzon Honda 3S Shop - Bolinao Branch. All rights reserved. | Licensed Honda Dealer
            </div>
            {/* <div className="flex flex-wrap gap-6 text-sm">
              <a href="#" className="text-gray-300 hover:text-white">Privacy Policy</a>
              <a href="#" className="text-gray-300 hover:text-white">Terms of Service</a>
              <a href="#" className="text-gray-300 hover:text-white">Cookie Policy</a>
              <a href="#" className="text-gray-300 hover:text-white">Sitemap</a>
            </div> */}
          </div>
        </div>
      </div>
    </footer>
  );
}