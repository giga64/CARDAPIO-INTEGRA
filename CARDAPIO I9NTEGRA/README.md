# Cardápio Integra - Componentes React

Este projeto implementa um sistema de modal usando React com componentes similares ao shadcn/ui, adaptados para JavaScript puro.

## 📁 Estrutura do Projeto

```
CARDAPIO-INTEGRA/
├── components/
│   ├── ui/
│   │   ├── dialog.jsx          # Componente Dialog principal
│   │   └── alert-dialog.jsx    # Componente AlertDialog
│   └── ProductModal.jsx        # Exemplo de uso do modal
├── lib/
│   └── utils.js                # Funções utilitárias
├── styles/
│   └── globals.css             # Estilos globais e variáveis CSS
├── tailwind.config.js          # Configuração do Tailwind CSS
└── README.md                   # Este arquivo
```

## 🚀 Como Usar

### 1. Instalação das Dependências

```bash
npm install react react-dom
npm install -D tailwindcss postcss autoprefixer
```

### 2. Configuração do Tailwind CSS

Certifique-se de que o `tailwind.config.js` está configurado corretamente e importe o arquivo CSS global:

```javascript
// No seu arquivo principal (ex: main.jsx ou App.jsx)
import './styles/globals.css';
```

### 3. Uso do Componente Dialog

```jsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from './components/ui/dialog';

function App() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setOpen(true)}>
        Abrir Modal
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Título do Modal</DialogTitle>
            <DialogDescription>
              Descrição do modal aqui...
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            Conteúdo do modal...
          </div>

          <DialogFooter>
            <button onClick={() => setOpen(false)}>
              Fechar
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
```

### 4. Uso do ProductModal (Exemplo Completo)

```jsx
import React, { useState } from 'react';
import ProductModal from './components/ProductModal';

function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const handleAddToCart = (item) => {
    console.log('Item adicionado ao carrinho:', item);
    // Implementar lógica do carrinho aqui
  };

  return (
    <div>
      {/* Lista de produtos */}
      <div onClick={() => handleProductClick({
        name: "Picanha na Brasa",
        description: "Suculenta picanha grelhada na brasa",
        price: 89.90,
        image: null
      })}>
        Picanha na Brasa - R$ 89,90
      </div>

      {/* Modal do produto */}
      <ProductModal
        product={selectedProduct}
        open={modalOpen}
        onOpenChange={setModalOpen}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}
```

## 🎨 Personalização

### Cores

As cores podem ser personalizadas editando as variáveis CSS no arquivo `styles/globals.css`:

```css
:root {
  --primary: 221.2 83.2% 53.3%;        /* Azul */
  --primary-foreground: 210 40% 98%;   /* Branco */
  --destructive: 0 84.2% 60.2%;        /* Vermelho */
  /* ... outras cores */
}
```

### Animações

As animações podem ser personalizadas no `tailwind.config.js`:

```javascript
keyframes: {
  "fade-in": {
    "0%": { opacity: "0" },
    "100%": { opacity: "1" },
  },
  // ... outras animações
}
```

## 📱 Responsividade

Os componentes são totalmente responsivos e se adaptam automaticamente a diferentes tamanhos de tela:

- **Desktop**: Modal centralizado com largura máxima
- **Tablet**: Modal adaptado para telas médias
- **Mobile**: Modal em tela cheia com controles otimizados

## 🔧 Funcionalidades

### Dialog
- ✅ Abertura/fechamento suave
- ✅ Animações de entrada/saída
- ✅ Backdrop com blur
- ✅ Fechamento com ESC ou clique no backdrop
- ✅ Foco automático no primeiro elemento interativo

### ProductModal
- ✅ Controles de quantidade (+/-)
- ✅ Campo de observações com contador
- ✅ Validação de entrada
- ✅ Formatação de preços
- ✅ Placeholder para imagens
- ✅ Design responsivo

## 🎯 Exemplo de Integração

```jsx
// Exemplo completo de integração com carrinho
import React, { useState } from 'react';
import ProductModal from './components/ProductModal';
import { formatPrice } from './lib/utils';

function MenuApp() {
  const [cart, setCart] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const addToCart = (item) => {
    setCart(prev => [...prev, item]);
    setModalOpen(false);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <div className="p-4">
      {/* Menu */}
      <div className="grid gap-4">
        {menuItems.map(item => (
          <div 
            key={item.id}
            onClick={() => {
              setSelectedProduct(item);
              setModalOpen(true);
            }}
            className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
          >
            <h3 className="font-bold">{item.name}</h3>
            <p className="text-gray-600">{item.description}</p>
            <p className="text-lg font-bold text-red-600">{formatPrice(item.price)}</p>
          </div>
        ))}
      </div>

      {/* Modal */}
      <ProductModal
        product={selectedProduct}
        open={modalOpen}
        onOpenChange={setModalOpen}
        onAddToCart={addToCart}
      />

      {/* Carrinho */}
      <div className="fixed bottom-4 right-4 bg-red-600 text-white p-4 rounded-full">
        🛒 {cart.length} itens - {formatPrice(getTotalPrice())}
      </div>
    </div>
  );
}
```

## 📝 Notas

- Os componentes são compatíveis com React 16.8+
- Requer Tailwind CSS para estilização
- Animações suaves e acessibilidade incluídas
- Totalmente customizável através de CSS e props 