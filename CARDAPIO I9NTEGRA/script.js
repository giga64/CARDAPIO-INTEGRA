document.addEventListener('DOMContentLoaded', function() {
    // Configuração do Intersection Observer para animações
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Aplicar animações aos elementos
    const sections = document.querySelectorAll('.menu-section');
    sections.forEach((section, index) => {
        section.classList.add('fade-in-hidden');
        section.style.animationDelay = `${index * 0.1}s`;
        observer.observe(section);
    });

    // Animações para itens do menu
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.05}s`;
    });

    // Animação do botão WhatsApp
    const whatsappBtn = document.querySelector('.whatsapp-button');
    if (whatsappBtn) {
        whatsappBtn.style.transform = 'scale(0)';
        setTimeout(() => {
            whatsappBtn.style.transition = 'transform 0.6s cubic-bezier(0.68, -0.55, 0.27, 1.55)';
            whatsappBtn.style.transform = 'scale(1)';
        }, 1000);
    }

    // Efeitos de hover nos itens do menu
    menuItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(8px) scale(1.02)';
        });

        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0) scale(1)';
        });

        // Adicionar evento de clique para abrir modal
        item.addEventListener('click', function() {
            openItemModal(this);
        });
    });

    // Smooth scroll para links internos
    const smoothScroll = (target) => {
        const element = document.querySelector(target);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

    // Adicionar efeito de parallax sutil no header
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            header.style.transform = `translateY(${rate}px)`;
        });
    }

    // Efeito de destaque nos preços
    const prices = document.querySelectorAll('.price');
    prices.forEach(price => {
        price.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.boxShadow = '0 4px 20px rgba(251, 36, 4, 0.3)';
        });

        price.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = 'none';
        });
    });

    // Animação de loading para imagens
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '0';
            this.style.transition = 'opacity 0.5s ease-in';
            setTimeout(() => {
                this.style.opacity = '1';
            }, 100);
        });
    });

    // Efeito de destaque nas seções ao passar o mouse
    sections.forEach(section => {
        section.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
        });

        section.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Adicionar classe de loading ao body
    document.body.classList.add('loaded');

    // Efeito de confete removido para melhor experiência do usuário

    // Adicionar efeito de scroll suave para o topo
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    // Adicionar botão de voltar ao topo
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '↑';
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 20px;
        width: 50px;
        height: 50px;
        background: var(--primary);
        color: var(--primary-foreground);
        border: none;
        border-radius: 50%;
        cursor: pointer;
        font-size: 20px;
        font-weight: bold;
        z-index: 999;
        opacity: 0;
        transition: var(--transition-smooth);
        box-shadow: var(--shadow-card);
    `;

    backToTopBtn.addEventListener('click', scrollToTop);
    document.body.appendChild(backToTopBtn);

    // Mostrar/ocultar botão de voltar ao topo
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.style.opacity = '1';
        } else {
            backToTopBtn.style.opacity = '0';
        }
    });

    // Adicionar efeito de hover no botão
    backToTopBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1)';
    });

    backToTopBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });

    // Inicializar funcionalidades do modal e carrinho
    initializeModalAndCart();

    console.log('🎉 Integra Cardápio carregado com sucesso!');
});

// --- FUNCIONALIDADES DO MODAL E CARRINHO ---

let cart = [];
let currentItem = null;

function initializeModalAndCart() {
    // Modal
    const modal = document.getElementById('itemModal');
    const closeBtn = document.querySelector('.close');
    
    // Fechar modal ao clicar no X
    closeBtn.addEventListener('click', closeModal);
    
    // Fechar modal ao clicar fora dele
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });
    
    // Fechar modal com ESC
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeModal();
        }
    });
    
    // Atualizar carrinho inicial
    updateCartDisplay();
}

function openItemModal(itemElement) {
    const modal = document.getElementById('itemModal');
    const itemName = itemElement.querySelector('.item-name').textContent;
    const itemDescription = itemElement.querySelector('.item-description')?.textContent || '';
    const itemPrice = itemElement.querySelector('.price').textContent;
    
    // Armazenar item atual
    currentItem = {
        name: itemName,
        description: itemDescription,
        price: itemPrice,
        priceValue: extractPriceValue(itemPrice)
    };
    
    // Preencher modal
    document.getElementById('modalItemName').textContent = itemName;
    document.getElementById('modalItemDescription').textContent = itemDescription;
    document.getElementById('modalItemPrice').textContent = itemPrice;
    document.getElementById('itemQuantity').value = 1;
    document.getElementById('itemObservations').value = '';
    
    // Mostrar modal
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('itemModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    currentItem = null;
}

function changeQuantity(delta) {
    const quantityInput = document.getElementById('itemQuantity');
    let newQuantity = parseInt(quantityInput.value) + delta;
    
    if (newQuantity < 1) newQuantity = 1;
    if (newQuantity > 99) newQuantity = 99;
    
    quantityInput.value = newQuantity;
}

function addToCart() {
    if (!currentItem) return;
    
    const quantity = parseInt(document.getElementById('itemQuantity').value);
    const observations = document.getElementById('itemObservations').value.trim();
    const existingItemIndex = cart.findIndex(item => item.name === currentItem.name);
    
    if (existingItemIndex !== -1) {
        // Item já existe no carrinho, aumentar quantidade
        cart[existingItemIndex].quantity += quantity;
        // Se há observações, adicionar ao item existente
        if (observations) {
            cart[existingItemIndex].observations = observations;
        }
    } else {
        // Adicionar novo item
        cart.push({
            ...currentItem,
            quantity: quantity,
            observations: observations
        });
    }
    
    updateCartDisplay();
    closeModal();
    
    // Feedback visual
    showNotification('Item adicionado ao carrinho! 🛒');
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartDisplay();
    showNotification('Item removido do carrinho!');
}

function updateCartQuantity(index, delta) {
    const newQuantity = cart[index].quantity + delta;
    
    if (newQuantity <= 0) {
        removeFromCart(index);
    } else {
        cart[index].quantity = newQuantity;
        updateCartDisplay();
    }
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const cartButtonCount = document.getElementById('cartButtonCount');
    const cartTotal = document.getElementById('cartTotal');
    
    // Limpar carrinho
    cartItems.innerHTML = '';
    
    // Adicionar itens
    cart.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        
        const observationsHtml = item.observations ? `<div class="cart-item-observations">Obs: ${item.observations}</div>` : '';
        
        itemElement.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">${item.price}</div>
                ${observationsHtml}
            </div>
            <div class="cart-item-quantity">
                <button onclick="updateCartQuantity(${index}, -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="updateCartQuantity(${index}, 1)">+</button>
            </div>
            <button class="remove-item" onclick="removeFromCart(${index})">×</button>
        `;
        cartItems.appendChild(itemElement);
    });
    
    // Atualizar contadores
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalValue = cart.reduce((sum, item) => sum + (item.priceValue * item.quantity), 0);
    
    cartCount.textContent = totalItems;
    cartButtonCount.textContent = totalItems;
    cartTotal.textContent = totalValue.toFixed(2).replace('.', ',');
    
    // Mostrar/ocultar botão do carrinho
    const cartButton = document.getElementById('cartButton');
    if (totalItems > 0) {
        cartButton.style.display = 'flex';
    } else {
        cartButton.style.display = 'none';
    }
}

function toggleCart() {
    const cart = document.getElementById('cart');
    cart.classList.toggle('open');
}

function sendToWhatsApp() {
    if (cart.length === 0) {
        showNotification('Carrinho vazio! Adicione itens primeiro.');
        return;
    }
    
    let message = '🍽️ *PEDIDO INTEGRA PETISCARIA* 🍽️\n\n';
    message += '*Itens do pedido:*\n\n';
    
    cart.forEach((item, index) => {
        message += `${index + 1}. *${item.name}*\n`;
        message += `   ${item.price} x ${item.quantity} un.\n`;
        if (item.observations) {
            message += `   _Obs: ${item.observations}_\n`;
        }
        message += '\n';
    });
    
    const totalValue = cart.reduce((sum, item) => sum + (item.priceValue * item.quantity), 0);
    message += `*Total: R$ ${totalValue.toFixed(2).replace('.', ',')}*\n\n`;
    message += '📍 *Endereço de entrega:*\n';
    message += '📞 *Telefone:*\n';
    message += '⏰ *Horário de entrega:*\n\n';
    message += 'Obrigado! 🍽️';
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/5584999339959?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    
    // Limpar carrinho após envio
    cart = [];
    updateCartDisplay();
    toggleCart();
    
    showNotification('Pedido enviado para o WhatsApp! 📱');
}

function extractPriceValue(priceString) {
    // Extrair valor numérico do preço (ex: "R$ 42,90" -> 42.90)
    const match = priceString.match(/R\$\s*(\d+),(\d+)/);
    if (match) {
        return parseFloat(match[1] + '.' + match[2]);
    }
    return 0;
}

function showNotification(message) {
    // Criar notificação
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--primary);
        color: var(--primary-foreground);
        padding: 1rem 1.5rem;
        border-radius: var(--radius);
        box-shadow: var(--shadow-card);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        font-weight: 500;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remover após 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Adicionar CSS para animações de notificação
const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
    @keyframes slideOutRight {
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
`;
document.head.appendChild(notificationStyle);