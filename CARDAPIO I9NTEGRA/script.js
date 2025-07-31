document.addEventListener('DOMContentLoaded', function() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.menu-section').forEach(section => {
        section.classList.add('fade-in-hidden');
        observer.observe(section);
    });

    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', () => openItemModal(item));
    });

    setupBackToTopButton();
    initializeModalAndCart();

    console.log('🎉 Integra Cardápio "Visual Feast" carregado com sucesso!');
});

function setupBackToTopButton() {
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '↑';
    backToTopBtn.className = 'back-to-top';
    document.body.appendChild(backToTopBtn);

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
}


// --- FUNCIONALIDADES DO MODAL E CARRINHO ---

let cart = [];
let currentItem = null;

function initializeModalAndCart() {
    const modal = document.getElementById('itemModal');
    const closeBtn = modal.querySelector('.close');
    const overlay = modal.querySelector('.modal-overlay');
    
    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);
    
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.classList.contains('open')) {
            closeModal();
        }
    });
    
    const cartElement = document.getElementById('cart');
    cartElement.querySelector('.close').addEventListener('click', toggleCart);
    cartElement.querySelector('.modal-overlay').addEventListener('click', toggleCart);

    updateCartDisplay();
}

function openItemModal(itemElement) {
    const modal = document.getElementById('itemModal');
    const itemName = itemElement.querySelector('.item-name').textContent;
    const itemDescription = itemElement.querySelector('.item-description')?.textContent || '';
    const itemPrice = itemElement.querySelector('.price').textContent;
    
    currentItem = {
        name: itemName,
        description: itemDescription,
        price: itemPrice,
        priceValue: extractPriceValue(itemPrice)
    };
    
    document.getElementById('modalItemName').textContent = itemName;
    document.getElementById('modalItemDescription').textContent = itemDescription;
    document.getElementById('modalItemPrice').textContent = itemPrice;
    document.getElementById('itemQuantity').value = 1;
    document.getElementById('itemObservations').value = '';
    
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('itemModal');
    modal.classList.remove('open');
    document.body.style.overflow = 'auto';
    currentItem = null;
}

function changeQuantity(delta) {
    const quantityInput = document.getElementById('itemQuantity');
    let newQuantity = parseInt(quantityInput.value) + delta;
    
    if (newQuantity < 1) newQuantity = 1;
    if (newQuantity > 99) newQuantity = 99;
    
    quantityInput.value = newQuantity;

    // Atualiza o preço total no modal
    if (currentItem) {
        const totalPrice = currentItem.priceValue * newQuantity;
        document.getElementById('modalItemPrice').textContent = `R$ ${totalPrice.toFixed(2).replace('.', ',')}`;
    }
}

function addToCart() {
    if (!currentItem) return;
    
    const quantity = parseInt(document.getElementById('itemQuantity').value);
    const observations = document.getElementById('itemObservations').value.trim();
    
    const existingItem = cart.find(item => item.name === currentItem.name && item.observations === observations);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            ...currentItem,
            quantity: quantity,
            observations: observations
        });
    }
    
    updateCartDisplay();
    closeModal();
    showNotification('Item adicionado ao carrinho! 🛒');
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartDisplay();
    showNotification('Item removido do carrinho!');
}

function updateCartQuantity(index, delta) {
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) {
        removeFromCart(index);
    } else {
        updateCartDisplay();
    }
}

function updateCartDisplay() {
    const cartItemsEl = document.getElementById('cartItems');
    const cartButtonCount = document.getElementById('cartButtonCount');
    const cartTotal = document.getElementById('cartTotal');
    
    cartItemsEl.innerHTML = '';
    
    cart.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        
        const observationsHtml = item.observations ? `<div class="cart-item-observations">Obs: ${item.observations}</div>` : '';
        
        itemElement.innerHTML = `
            <div class="flex-1">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">${item.price}</div>
                ${observationsHtml}
            </div>
            <div class="flex items-center gap-2">
                <button onclick="updateCartQuantity(${index}, -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="updateCartQuantity(${index}, 1)">+</button>
            </div>
            <button class="remove-item" onclick="removeFromCart(${index})">&times;</button>
        `;
        cartItemsEl.appendChild(itemElement);
    });
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalValue = cart.reduce((sum, item) => sum + (item.priceValue * item.quantity), 0);
    
    cartButtonCount.textContent = totalItems;
    cartTotal.textContent = totalValue.toFixed(2).replace('.', ',');
    
    const cartButton = document.getElementById('cartButton');
    cartButton.style.display = totalItems > 0 ? 'flex' : 'none';
}

function toggleCart() {
    document.getElementById('cart').classList.toggle('open');
    const isOpen = document.getElementById('cart').classList.contains('open');
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
}

function sendToWhatsApp() {
    if (cart.length === 0) {
        showNotification('Carrinho vazio!');
        return;
    }
    
    let message = '🍽️ *PEDIDO INTEGRA PETISCARIA* 🍽️\n\n';
    
    cart.forEach(item => {
        message += `*${item.quantity}x ${item.name}* (${item.price})\n`;
        if (item.observations) {
            message += `   _Obs: ${item.observations}_\n`;
        }
    });
    
    const totalValue = cart.reduce((sum, item) => sum + (item.priceValue * item.quantity), 0);
    message += `\n*Total: R$ ${totalValue.toFixed(2).replace('.', ',')}*`;
    
    const whatsappUrl = `https://wa.me/5584999339959?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
    
    cart = [];
    updateCartDisplay();
    toggleCart();
}

function extractPriceValue(priceString) {
    const cleanedString = priceString.replace('R$', '').replace('.', '').replace(',', '.').trim();
    const price = parseFloat(cleanedString);
    return isNaN(price) ? 0 : price;
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: hsl(var(--foreground));
        color: hsl(var(--background));
        padding: 0.75rem 1.5rem;
        border-radius: var(--radius);
        box-shadow: var(--shadow-modal);
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s, transform 0.3s;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translate(-50%, -10px)';
    }, 10);

    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translate(-50%, 10px)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}
