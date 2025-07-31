# 🍴 Integra Bar & Restaurante - Cardápio Digital

Um cardápio digital moderno e responsivo desenvolvido com React, TypeScript e Tailwind CSS. Permite aos clientes visualizar o menu, adicionar itens ao carrinho e finalizar pedidos via WhatsApp.

## ✨ Funcionalidades

- 📱 **Design Responsivo** - Funciona perfeitamente em desktop, tablet e mobile
- 🛒 **Carrinho de Compras** - Adicione itens, ajuste quantidades e gerencie observações
- 📸 **Galeria de Imagens** - Visualize fotos dos pratos (com placeholders)
- 💬 **Integração WhatsApp** - Finalize pedidos diretamente no WhatsApp
- 🎨 **Interface Moderna** - Design elegante com animações suaves
- ⚡ **Performance Otimizada** - Carregamento rápido e experiência fluida

## 🚀 Tecnologias Utilizadas

- **React 18** - Biblioteca principal para UI
- **TypeScript** - Tipagem estática para maior segurança
- **Tailwind CSS** - Framework CSS utilitário
- **Vite** - Build tool rápida e moderna
- **Sonner** - Biblioteca de notificações toast
- **Radix UI** - Componentes acessíveis (inspirado)

## 📁 Estrutura do Projeto

```
CARDAPIO-INTEGRA/
├── components/
│   ├── ui/
│   │   └── dialog.tsx          # Componente Dialog reutilizável
│   ├── Header.tsx              # Cabeçalho da aplicação
│   ├── Footer.tsx              # Rodapé da aplicação
│   ├── MenuCard.tsx            # Card de seção do menu
│   ├── ProductModal.tsx        # Modal de detalhes do produto
│   └── Cart.tsx                # Componente do carrinho
├── lib/
│   └── utils.ts                # Funções utilitárias
├── assets/
│   └── index.ts                # Exportação de imagens
├── styles/
│   └── globals.css             # Estilos globais e variáveis CSS
├── App.tsx                     # Componente principal
├── main.tsx                    # Ponto de entrada
├── index.html                  # HTML base
├── package.json                # Dependências e scripts
├── tsconfig.json               # Configuração TypeScript
├── vite.config.ts              # Configuração Vite
├── tailwind.config.js          # Configuração Tailwind CSS
└── README.md                   # Este arquivo
```

## 🛠️ Instalação e Configuração

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd CARDAPIO-INTEGRA/CARDAPIO\ I9NTEGRA
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Execute o projeto
```bash
npm run dev
```

O projeto estará disponível em `http://localhost:5173`

### 4. Build para produção
```bash
npm run build
```

## 🎯 Como Usar

### Estrutura de Dados do Menu

```typescript
interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string; // URL da imagem (opcional)
}

// Exemplo de dados
const menuData = {
  pratos: [
    {
      id: "1",
      name: "Picanha na Brasa",
      description: "Suculenta picanha grelhada na brasa...",
      price: 89.90,
      image: "url-da-imagem.jpg"
    }
  ],
  bebidas: [...],
  sobremesas: [...]
};
```

### Personalização

#### 1. Alterar Informações do Restaurante
Edite os componentes `Header.tsx` e `Footer.tsx` para atualizar:
- Nome do restaurante
- Telefone
- Endereço
- Horário de funcionamento

#### 2. Configurar WhatsApp
No arquivo `App.tsx`, altere a variável `whatsappNumber`:
```typescript
const whatsappNumber = "5511999999999"; // Seu número do WhatsApp
```

#### 3. Adicionar Imagens
1. Adicione as imagens na pasta `assets/`
2. Importe-as no arquivo `assets/index.ts`:
```typescript
export { default as dishMeat } from './dish-meat.jpg';
export { default as dishPasta } from './dish-pasta.jpg';
```

#### 4. Personalizar Cores
Edite as variáveis CSS no arquivo `styles/globals.css`:
```css
:root {
  --primary: 221.2 83.2% 53.3%;        /* Cor principal */
  --destructive: 0 84.2% 60.2%;        /* Cor de destaque */
  /* ... outras cores */
}
```

## 📱 Responsividade

O projeto é totalmente responsivo e se adapta a diferentes tamanhos de tela:

- **Desktop (> 1024px)**: Layout em grid com 3 colunas
- **Tablet (768px - 1024px)**: Layout em grid com 2 colunas
- **Mobile (< 768px)**: Layout em coluna única, modal em tela cheia

## 🔧 Funcionalidades Detalhadas

### Carrinho de Compras
- ✅ Adicionar/remover itens
- ✅ Ajustar quantidades
- ✅ Adicionar observações por item
- ✅ Cálculo automático de totais
- ✅ Persistência durante a sessão

### Modal de Produto
- ✅ Visualização detalhada do item
- ✅ Controles de quantidade
- ✅ Campo de observações
- ✅ Imagem do produto (com placeholder)
- ✅ Animações suaves

### Integração WhatsApp
- ✅ Formatação automática da mensagem
- ✅ Inclusão de observações
- ✅ Cálculo de subtotais e total
- ✅ Abertura em nova aba

## 🎨 Design System

### Cores
- **Primária**: Vermelho (#dc2626) - Botões e elementos de destaque
- **Secundária**: Verde (#16a34a) - Botão WhatsApp
- **Neutra**: Cinza (#6b7280) - Textos secundários

### Tipografia
- **Títulos**: Playfair Display (elegante)
- **Corpo**: Inter (moderna e legível)

### Componentes
- **Cards**: Bordas arredondadas, sombras suaves
- **Botões**: Estados hover, transições suaves
- **Modais**: Backdrop blur, animações de entrada/saída

## 🚀 Deploy

### Vercel (Recomendado)
1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente se necessário
3. Deploy automático a cada push

### Netlify
1. Faça build: `npm run build`
2. Faça upload da pasta `dist/`
3. Configure o domínio personalizado

### GitHub Pages
1. Adicione no `package.json`:
```json
{
  "homepage": "https://seu-usuario.github.io/seu-repo",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para dúvidas ou suporte:
- 📧 Email: contato@integra.com.br
- 📱 WhatsApp: (11) 99999-9999

---

Desenvolvido com ❤️ para o Integra Bar & Restaurante 