// Adicione esta linha no seu HTML, antes de carregar o script.js
// <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

document.addEventListener('DOMContentLoaded', function() {
    
    // --- 1. CONFIGURAÇÃO DO SUPABASE ---
    const SUPABASE_URL = 'Chttps://llpyzevrzgfqwxvbguli.supabase.co'; // <-- COLE A SUA URL AQUI
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxscHl6ZXZyemdmcXd4dmJndWxpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5MDk5MTIsImV4cCI6MjA2OTQ4NTkxMn0.RYHbYNr-7Ksb-WmuOTOrQETB1tx_IUP1FC_JBuzdn60'; // <-- COLE A SUA CHAVE AQUI

    const { createClient } = supabase;
    const _supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // --- 2. ESTADO DA APLICAÇÃO ---
    let allProducts = [];
    let allCategories = [];

    // --- 3. FUNÇÃO PRINCIPAL DE INICIALIZAÇÃO ---
    async function initializeApp() {
        showLoadingState();
        await fetchData();
        renderCategories();
        renderMenu();
        setupEventListeners();
        hideLoadingState();
        initializeModalAndCart(); // Mantém suas funções de modal e carrinho
    }

    // --- 4. FUNÇÕES DE BUSCA E RENDERIZAÇÃO ---
    async function fetchData() {
        const { data: categoriesData, error: catError } = await _supabase
            .from('categories')
            .select('*')
            .order('order_index');

        const { data: productsData, error: prodError } = await _supabase
            .from('products')
            .select('*');

        if (catError || prodError) {
            console.error('Erro ao buscar dados:', catError || prodError);
            // Você pode mostrar uma mensagem de erro na tela aqui
            return;
        }
        allCategories = categoriesData;
        allProducts = productsData;
    }

    function renderCategories() {
        const container = document.getElementById('filterContainer');
        container.innerHTML = ''; // Limpa antes de renderizar

        const allButton = document.createElement('button');
        allButton.className = 'filter-btn active';
        allButton.textContent = 'Todos';
        allButton.dataset.categoryId = 'all';
        container.appendChild(allButton);

        allCategories.forEach(category => {
            const button = document.createElement('button');
            button.className = 'filter-btn';
            button.textContent = category.name;
            button.dataset.categoryId = category.id;
            container.appendChild(button);
        });
    }

    function renderMenu(searchTerm = '', categoryId = 'all') {
        const container = document.querySelector('.container');
        // Remove seções de menu antigas, mantendo os controles
        document.querySelectorAll('.menu-section').forEach(section => section.remove());

        const filteredProducts = allProducts.filter(product => {
            const matchesCategory = categoryId === 'all' || product.category_id == categoryId;
            const matchesSearch = !searchTerm || product.name.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesCategory && matchesSearch;
        });

        allCategories.forEach(category => {
            const productsInCategory = filteredProducts.filter(p => p.category_id === category.id);
            if (productsInCategory.length > 0) {
                const section = document.createElement('div');
                section.className = 'menu-section';

                let productsHTML = '';
                productsInCategory.forEach(product => {
                    productsHTML += `
                        <div class="menu-item" data-product-id="${product.id}">
                            <div class="item-details">
                                <span class="item-name">${product.name}</span>
                                ${product.description ? `<div class="item-description">${product.description}</div>` : ''}
                            </div>
                            <span class="price">${product.price_details || `R$ ${product.price.toFixed(2).replace('.', ',')}`}</span>
                        </div>
                    `;
                });

                section.innerHTML = `<h2>${category.name}</h2>${productsHTML}`;
                container.appendChild(section);
            }
        });
        
        // Re-aplica o evento de clique para os novos itens do menu
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', () => openItemModal(item));
        });
    }

    // --- 5. OUVINTES DE EVENTOS (EVENT LISTENERS) ---
    function setupEventListeners() {
        const searchInput = document.getElementById('searchInput');
        const filterContainer = document.getElementById('filterContainer');

        searchInput.addEventListener('input', () => {
            const categoryId = filterContainer.querySelector('.active').dataset.categoryId;
            renderMenu(searchInput.value, categoryId);
        });

        filterContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-btn')) {
                filterContainer.querySelector('.active').classList.remove('active');
                e.target.classList.add('active');
                renderMenu(searchInput.value, e.target.dataset.categoryId);
            }
        });
    }

    // --- 6. FUNÇÕES AUXILIARES ---
    function showLoadingState() {
        // Você pode criar um spinner/loading visual aqui
        console.log("Carregando cardápio...");
    }

    function hideLoadingState() {
        console.log("Cardápio carregado!");
    }

    // --- INICIA A APLICAÇÃO ---
    initializeApp();

    // --- SUAS FUNÇÕES DE MODAL E CARRINHO (AJUSTADAS) ---
    // O restante do seu código de modal e carrinho vem aqui.
    // A única alteração é na função openItemModal
    
    let cart = [];
    let currentItem = null;

    function initializeModalAndCart() {
        const modal = document.getElementById('itemModal');
        const closeBtn = document.querySelector('.close');
        
        closeBtn.addEventListener('click', closeModal);
        window.addEventListener('click', (event) => {
            if (event.target === modal) closeModal();
        });
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') closeModal();
        });
        
        updateCartDisplay();
    }

    function openItemModal(itemElement) {
        const productId = itemElement.dataset.productId;
        const productData = allProducts.find(p => p.id == productId);

        if (!productData) return;

        const modal = document.getElementById('itemModal');
        
        currentItem = {
            id: productData.id,
            name: productData.name,
            description: productData.description,
            price: productData.price_details || `R$ ${productData.price.toFixed(2).replace('.', ',')}`,
            priceValue: productData.price
        };
        
        document.getElementById('modalItemName').textContent = currentItem.name;
        document.getElementById('modalItemDescription').textContent = currentItem.description || '';
        document.getElementById('modalItemPrice').textContent = currentItem.price;
        document.getElementById('itemQuantity').value = 1;
        document.getElementById('itemObservations').value = '';
        
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    // Todas as suas outras funções (closeModal, changeQuantity, addToCart, etc.)
    // podem ser coladas aqui sem alterações.
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
        const existingItemIndex = cart.findIndex(item => item.id === currentItem.id && item.observations === observations);
        
        if (existingItemIndex !== -1) {
            cart[existingItemIndex].quantity += quantity;
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
        
        cartItems.innerHTML = '';
        
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
        
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const totalValue = cart.reduce((sum, item) => sum + (item.priceValue * item.quantity), 0);
        
        cartCount.textContent = totalItems;
        cartButtonCount.textContent = totalItems;
        cartTotal.textContent = totalValue.toFixed(2).replace('.', ',');
        
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
        
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/5584999339959?text=${encodedMessage}`;
        
        window.open(whatsappUrl, '_blank');
        
        cart = [];
        updateCartDisplay();
        toggleCart();
        
        showNotification('Pedido enviado para o WhatsApp! 📱');
    }

    function showNotification(message) {
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
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    const notificationStyle = document.createElement('style');
    notificationStyle.textContent = `
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(100%);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        @keyframes slideOutRight {
            to {
                opacity: 0;
                transform: translateX(100%);
            }
        }
    `;
    document.head.appendChild(notificationStyle);

});