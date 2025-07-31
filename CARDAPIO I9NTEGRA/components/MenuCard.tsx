import React from 'react';
import { formatPrice } from '../lib/utils';
import { MenuItem } from './ProductModal';

interface MenuCardProps {
  title: string;
  items: MenuItem[];
  onItemClick: (item: MenuItem) => void;
}

const MenuCard: React.FC<MenuCardProps> = ({ title, items, onItemClick }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
      </div>
      
      <div className="p-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => onItemClick(item)}
              className="bg-gray-50 rounded-lg p-4 cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-105 border border-gray-200"
            >
              {/* Imagem do item */}
              <div className="relative w-full h-48 bg-gray-200 rounded-lg overflow-hidden mb-4">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-gray-500">
                      <div className="text-3xl mb-2">🍽️</div>
                      <p className="text-sm">Foto em breve</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Informações do item */}
              <div className="space-y-2">
                <h3 className="font-bold text-lg text-gray-900 line-clamp-2">
                  {item.name}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-3">
                  {item.description}
                </p>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xl font-bold text-red-600">
                    {formatPrice(item.price)}
                  </span>
                  <button className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                    Ver Detalhes
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenuCard; 