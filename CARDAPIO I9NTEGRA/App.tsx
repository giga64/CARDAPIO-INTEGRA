import { useState } from "react";
import { Toaster } from "sonner";
import Header from "@/components/Header";
import MenuCard, { MenuItem } from "@/components/MenuCard";
import ProductModal from "@/components/ProductModal";
import Cart, { CartItem } from "@/components/Cart";
import Footer from "@/components/Footer";
import { dishMeat, dishPasta, drinkCocktail } from "@/assets";

const App = () => {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Menu data - em produção viria de uma API
  const menuData = {
    pratos: [
      {
        id: "1",
        name: "Picanha na Brasa",
        description: "Suculenta picanha grelhada na brasa, acompanha arroz de alho, farofa especial da casa e vinagrete tradicional",
        price: 89.90,
        image: dishMeat
      },
      {
        id: "2", 
        name: "Linguine Frutos do Mar",
        description: "Massa artesanal com camarões, lulas e mexilhões ao molho de tomate fresco com ervas finas e azeite trufado",
        price: 75.50,
        image: dishPasta
      },
      {
        id: "3",
        name: "Salmão Grelhado",
        description: "Filé de salmão com crosta de ervas, purê de mandioquinha e legumes da estação",
        price: 82.00
      },
      {
        id: "4",
        name: "Risotto de Cogumelos",
        description: "Cremoso risotto de arbóreo com mix de cogumelos frescos, parmesão envelhecido e trufa negra",
        price: 68.90
      }
    ],
    bebidas: [
      {
        id: "5",
        name: "Integra Signature",
        description: "Coquetel exclusivo da casa com cachaça artesanal, licor de jabuticaba e espuma de limão siciliano",
        price: 32.50,
        image: drinkCocktail
      },
      {
        id: "6",
        name: "Caipirinha Premium",
        description: "Cachaça envelhecida de alambique, limão tahiti orgânico e açúcar cristal",
        price: 28.00
      },
      {
        id: "7",
        name: "Vinho Tinto Seleção",
        description: "Taça de Cabernet Sauvignon reserva, safra 2020, notas de frutas vermelhas",
        price: 35.00
      }
    ],
    sobremesas: [
      {
        id: "8",
        name: "Petit Gateau",
        description: "Bolinho quente de chocolate belga com sorvete de baunilha artesanal e calda de frutas vermelhas",
        price: 24.90
      },
      {
        id: "9",
        name: "Tiramisù da Casa",
        description: "Clássico italiano com camadas de biscoito champagne, creme mascarpone e café expresso",
        price: 22.50
      }
    ]
  };

  const handleItemClick = (item: MenuItem) => {
    setSelectedItem(item);
  };

  const handleAddToCart = (item: MenuItem, quantity: number, observations?: string) => {
    setCartItems(prev => {
      const existingItem = prev.find(cartItem => cartItem.id === item.id);
      
      if (existingItem) {
        return prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        );
      } else {
        return [...prev, { ...item, quantity, observations }];
      }
    });
    
    // Simular toast (em produção, use a biblioteca sonner)
    console.log(`${item.name} adicionado ao carrinho!`, {
      description: `Quantidade: ${quantity}${observations ? ` • ${observations}` : ''}`,
    });
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity === 0) {
      handleRemoveItem(id);
      return;
    }

    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
    console.log("Item removido do carrinho");
  };

  const handleCheckout = (items: CartItem[]) => {
    // Formatação da mensagem para WhatsApp
    let message = "🍴 *Pedido Integra Bar & Restaurante*\n\n";
    
    items.forEach(item => {
      message += `${item.quantity}x ${item.name}\n`;
      if (item.observations) {
        message += `📝 ${item.observations}\n`;
      }
      message += `R$ ${item.price.toFixed(2)} cada\n`;
      message += `Subtotal: R$ ${(item.price * item.quantity).toFixed(2)}\n\n`;
    });

    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    message += `*Total: R$ ${total.toFixed(2)}*\n\n`;
    message += "Gostaria de confirmar este pedido!";

    // Número do WhatsApp (em produção seria configurável)
    const whatsappNumber = "5511999999999";
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappURL, '_blank');
    
    console.log("Redirecionando para WhatsApp...", {
      description: "Finalize seu pedido por lá!",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Cardápio Digital
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Desfrute dos sabores únicos do nosso gastropub. Clique nos pratos para ver detalhes 
            e monte seu pedido para delivery ou retirada.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          <MenuCard
            title="Pratos Principais"
            items={menuData.pratos}
            onItemClick={handleItemClick}
          />
          
          <MenuCard
            title="Bebidas"
            items={menuData.bebidas}
            onItemClick={handleItemClick}
          />
          
          <MenuCard
            title="Sobremesas"
            items={menuData.sobremesas}
            onItemClick={handleItemClick}
          />
        </div>
      </main>

      <Footer />

      <ProductModal
        item={selectedItem}
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        onAddToCart={handleAddToCart}
      />

      <Cart
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
      />

      <Toaster position="top-right" />
    </div>
  );
};

export default App; 