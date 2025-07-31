import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from './ui/dialog'; //
import { formatPrice } from '../lib/utils'; //

const ProductModal = ({ product, open, onOpenChange, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [observations, setObservations] = useState('');

  // Garante que o estado de quantidade seja resetado ao abrir um novo produto
  // e as observações também.
  React.useEffect(() => {
    if (open) {
      setQuantity(1);
      setObservations('');
    }
  }, [open, product]);

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
    <Dialog open={open} onOpenChange={onOpenChange}> {/* */}
      <DialogContent className="max-w-md p-0 overflow-hidden"> {/* Removido padding interno e adicionado overflow-hidden para bordas da imagem */}
        {/* Imagem do produto no topo do modal */}
        <div className="relative w-full h-64 bg-gray-100 overflow-hidden"> {/* Removido rounded-lg para a imagem ocupar todo o topo */}
          {product?.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-50 text-gray-400"> {/* Fundo mais suave para placeholder */}
              <div className="text-center">
                <div className="text-5xl mb-2">📸</div> {/* Ícone maior */}
                <p className="text-sm font-medium">Foto será adicionada em breve</p>
              </div>
            </div>
          )}
        </div>

        <div className="p-6"> {/* Conteúdo principal do modal com padding */}
          <DialogHeader className="text-center mb-4">
            <DialogTitle className="text-3xl font-bold text-gray-800 leading-tight"> {/* Fonte maior, negrito e cor mais escura */}
              {product?.name}
            </DialogTitle>
            <DialogDescription className="text-base text-gray-600 mt-2"> {/* Fonte maior e margem superior */}
              {product?.description}
            </DialogDescription>
          </DialogHeader>

          {/* Preço - Destaque */}
          <div className="flex items-center justify-between mt-6 mb-6 p-4 bg-red-50 border border-red-100 rounded-lg"> {/* Destaque visual para o preço */}
            <span className="text-lg font-semibold text-gray-700">Preço:</span>
            <span className="text-3xl font-extrabold text-red-600"> {/* Fonte maior e mais negrito para o preço */}
              {formatPrice(product?.price || 0)} {/* */}
            </span>
          </div>

          {/* Controles de quantidade */}
          <div className="flex items-center justify-center gap-6 mb-6 py-3 px-4 bg-gray-50 rounded-lg border border-gray-200"> {/* Ajustes no espaçamento e borda */}
            <label className="font-semibold text-lg text-gray-700">Quantidade:</label> {/* Fonte maior e mais negrito */}
            <div className="flex items-center gap-3"> {/* Ajuste no espaçamento */}
              <button
                onClick={() => handleQuantityChange(-1)}
                className="w-12 h-12 bg-red-600 text-white text-2xl rounded-full flex items-center justify-center hover:bg-red-700 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2" // Botões maiores e com melhor foco
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Math.min(99, parseInt(e.target.value) || 1)))}
                className="w-20 h-12 text-center text-xl font-bold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200" // Campo maior, texto maior
                min="1"
                max="99"
              />
              <button
                onClick={() => handleQuantityChange(1)}
                className="w-12 h-12 bg-red-600 text-white text-2xl rounded-full flex items-center justify-center hover:bg-red-700 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2" // Botões maiores e com melhor foco
              >
                +
              </button>
            </div>
          </div>

          {/* Campo de observações */}
          <div className="mb-6"> {/* Aumentar margem inferior */}
            <label className="block text-base font-semibold text-gray-700 mb-2"> {/* Fonte maior e negrito */}
              Observações (opcional):
            </label>
            <textarea
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              placeholder="Ex: Sem cebola, bem passado, molho à parte..."
              className="w-full h-24 p-3 border border-gray-300 rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 text-base" // Altura maior e texto maior
              maxLength={200}
            />
            <div className="text-sm text-gray-500 text-right mt-1"> {/* Texto menor e alinhado à direita */}
              {observations.length}/200 caracteres
            </div>
          </div>

          {/* Botão adicionar ao carrinho */}
          <DialogFooter className="mt-auto pt-4 border-t border-gray-100"> {/* Adicionado borda superior para separar do conteúdo */}
            <button
              onClick={handleAddToCart}
              className="w-full bg-red-600 text-white py-4 px-6 rounded-lg font-bold text-lg hover:bg-red-700 transition-colors duration-200 ease-in-out shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2" // Botão maior, mais negrito, com sombra
            >
              🛒 Adicionar ao Carrinho
            </button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;