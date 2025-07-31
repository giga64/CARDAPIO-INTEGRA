import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-lg border-b border-gray-200">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">I</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Integra</h1>
              <p className="text-sm text-gray-600">Bar & Restaurante</p>
            </div>
          </div>

          {/* Informações de contato */}
          <div className="hidden md:flex items-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <span>📞</span>
              <span>(11) 99999-9999</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>📍</span>
              <span>São Paulo, SP</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>🕒</span>
              <span>18h às 00h</span>
            </div>
          </div>

          {/* Botão WhatsApp */}
          <a
            href="https://wa.me/5511999999999"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <span>📱</span>
            <span className="hidden sm:inline">WhatsApp</span>
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header; 