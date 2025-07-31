import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from './ui/dialog';
import { formatPrice } from '../lib/utils';

const ProductModal = ({ product, open, onOpenChange, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [observations, setObservations] = useState('');

  const handleAddToCart = () => {
    onAddToCart({
      ...product,
      quantity,
      observations: observations.trim()
    });
    setQuantity(1);
    setObservations('');
    onOpenChange(false);
  };

  const handleQuantityChange = (delta) => {
    const newQuantity = Math.max(1, Math.min(99, quantity + delta));
    setQuantity(newQuantity);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {product?.name}
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600">
            {product?.description}
          </DialogDescription>
        </DialogHeader>

        {/* Imagem do produto */}
        <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden mb-4">
          {product?.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                <div className="text-4xl mb-2">📸</div>
                <p className="text-sm">Foto será adicionada em breve</p>
              </div>
            </div>
          )}
        </div>

        {/* Preço */}
        <div className="text-center mb-4">
          <span className="text-2xl font-bold text-red-600">
            {formatPrice(product?.price || 0)}
          </span>
        </div>

        {/* Controles de quantidade */}
        <div className="flex items-center justify-center gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
          <label className="font-medium">Quantidade:</label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleQuantityChange(-1)}
              className="w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
            >
              -
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Math.min(99, parseInt(e.target.value) || 1)))}
              className="w-16 h-10 text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              min="1"
              max="99"
            />
            <button
              onClick={() => handleQuantityChange(1)}
              className="w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
            >
              +
            </button>
          </div>
        </div>

        {/* Campo de observações */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Observações (opcional):
          </label>
          <textarea
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
            placeholder="Ex: Sem cebola, bem passado, molho à parte..."
            className="w-full h-20 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-red-500"
            maxLength={200}
          />
          <div className="text-xs text-gray-500 text-right mt-1">
            {observations.length}/200 caracteres
          </div>
        </div>

        {/* Botão adicionar ao carrinho */}
        <DialogFooter>
          <button
            onClick={handleAddToCart}
            className="w-full bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            🛒 Adicionar ao Carrinho
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal; 