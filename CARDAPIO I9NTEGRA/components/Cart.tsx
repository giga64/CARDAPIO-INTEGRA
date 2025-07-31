import React, { useState } from 'react';
import { formatPrice } from '../lib/utils';
import { MenuItem } from './ProductModal';

// Interfaces
export interface CartItem extends MenuItem {
  quantity: number;
  observations?: string;
}

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: (items: CartItem[]) => void;
}

const Cart: React.FC<CartProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleQuantityChange = (id: string, delta: number) => {
    const item = items.find(item => item.id === id);
    if (item) {
      const newQuantity = Math.max(0, item.quantity + delta);
      onUpdateQuantity(id, newQuantity);
    }
  };

  if (items.length === 0) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-red-600 text-white p-4 rounded-full shadow-lg hover:bg-red-700 transition-colors"
        >
          🛒
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Botão do carrinho */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-red-600 text-white p-4 rounded-full shadow-lg hover:bg-red-700 transition-colors relative"
        >
          🛒
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </button>
      </div>

      {/* Modal do carrinho */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsOpen(false)}>
          <div 
            className="fixed bottom-4 right-4 w-96 max-h-96 bg-white rounded-lg shadow-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-red-600 text-white px-4 py-3 flex justify-between items-center">
              <h3 className="font-bold text-lg">🛒 Seu Carrinho</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-200"
              >
                ✕
              </button>
            </div>

            {/* Lista de itens */}
            <div className="max-h-64 overflow-y-auto p-4">
              {items.map((item) => (
                <div key={item.id} className="border-b border-gray-200 pb-3 mb-3 last:border-b-0">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{item.name}</h4>
                      {item.observations && (
                        <p className="text-sm text-gray-600 mt-1">
                          📝 {item.observations}
                        </p>
                      )}
                      <p className="text-sm text-gray-500">
                        {formatPrice(item.price)} cada
                      </p>
                    </div>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-red-500 hover:text-red-700 ml-2"
                    >
                      🗑️
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleQuantityChange(item.id, -1)}
                        className="w-8 h-8 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center hover:bg-gray-300"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.id, 1)}
                        className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700"
                      >
                        +
                      </button>
                    </div>
                    <span className="font-semibold text-gray-900">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-lg">Total:</span>
                <span className="font-bold text-xl text-red-600">
                  {formatPrice(totalPrice)}
                </span>
              </div>
              
              <button
                onClick={() => {
                  onCheckout(items);
                  setIsOpen(false);
                }}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                📱 Finalizar Pedido no WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Cart; 