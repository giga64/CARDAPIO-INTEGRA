 document.addEventListener('DOMContentLoaded', function() {
    
    // --- 1. CONFIGURAÇÃO DO SUPABASE ---
    const SUPABASE_URL = 'https://llpyzevrzgfqwxvbguli.supabase.co'; // <-- INSIRA SUA URL
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxscHl6ZXZyemdmcXd4dmJndWxpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5MDk5MTIsImV4cCI6MjA2OTQ4NTkxMn0.RYHbYNr-7Ksb-WmuOTOrQETB1tx_IUP1FC_JBuzdn60JhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxscHl6ZXZyemdmcXd4dmJndWxpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5MDk5MTIsImV4cCI6MjA2OTQ4NTkxMn0.RYHbYNr-7Ksb-WmuOTOrQETB1tx_IUP1FC_JBuzdn60'; // <-- INSIRA SUA CHAVE

    const { createClient } = supabase;
    const _supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // --- 2. ESTADO DA APLICAÇÃO ---
    let allProducts = [];
    let allCategories = [];
    let cart = [];
    let currentItem = null;

    // --- 3. FUNÇÃO PRINCIPAL DE INICIALIZAÇÃO ---
    async function initializeApp() {
        await fetchData();
        renderCategories();
        renderMenu();
        setupEventListeners();
        initializeModalAndCart();
    }

    // --- 4. FUNÇÕES DE BUSCA E RENDERIZAÇÃO ---
    async function fetchData() {
        const menuContainer = document.getElementById('menuContent');
        if(menuContainer) menuContainer.innerHTML = '<div class="loading-placeholder"><p>Carregando cardápio...</p></div>';

        const { data: categoriesData, error: catError } = await _supabase
            .from('categories')
            .select('*')
            .order('order_index');

        const { data: productsData, error: prodError } = await _supabase
            .from('products')
            .select('*');

        if (catError || prodError) {
            console.error('Erro ao buscar dados:', catError || prodError);
            if(menuContainer) menuContainer.innerHTML = '<div class="loading-placeholder"><p>Erro ao carregar o cardápio. Tente recarregar a página.</p></div>';
            return;
        }
        allCategories = categoriesData;
        allProducts = productsData;
    }

    function renderCategories() {
        const container = document.getElementById('filterContainer');
        if (!container) return;
        container.innerHTML = ''; 

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
        const container = document.getElementById('menuContent');
        if (!container) return;
        container.innerHTML = '';

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
                    const priceText = product.price_details || `R$ ${product.price.toFixed(2).replace('.', ',')}`;
                    const descriptionHTML = product.description ? `<div class="item-description">${product.description}</div>` : '';
                    productsHTML += `
                        <div class="menu-item" data-product-id="${product.id}">
                            <div class="item-details">
                                <span class="item-name">${product.name}</span>
                                ${descriptionHTML}
                            </div>
                            <span class="price">${priceText}</span>
                        </div>
                    `;
                });

                section.innerHTML = `<h2>${category.name}</h2>${productsHTML}`;
                container.appendChild(section);
            }
        });
        
        // Re-aplica eventos de clique e animação
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', () => {
                const productId = item.dataset.productId;
                const productData = allProducts.find(p => p.id == productId);
                if (productData) {
                    openItemModal(productData);
                }
            });
        });
        setupOriginalEventListeners(); // Reativa as animações
    }

    // --- 5. OUVINTES DE EVENTOS ---
    function setupEventListeners() {
        const searchInput = document.getElementById('searchInput');
        const filterContainer = document.getElementById('filterContainer');

        if(searchInput && filterContainer) {
            searchInput.addEventListener('input', () => {
                const activeFilter = filterContainer.querySelector('.active');
                const categoryId = activeFilter ? activeFilter.dataset.categoryId : 'all';
                renderMenu(searchInput.value, categoryId);
            });
            
            filterContainer.addEventListener('click', (e) => {
                if (e.target.classList.contains('filter-btn')) {
                    const currentActive = filterContainer.querySelector('.active');
                    if (currentActive) currentActive.classList.remove('active');
                    e.target.classList.add('active');
                    renderMenu(searchInput.value, e.target.dataset.categoryId);
                }
            });
        }
    }

    // --- CÓDIGO DO MODAL, CARRINHO E SUAS FUNÇÕES ORIGINAIS ---

    function openItemModal(productData) {
        const modal = document.getElementById('itemModal');
        
        currentItem = {
            id: productData.id,
            name: productData.name,
            description: productData.description,
            price: productData.price_details || `R$ ${productData.price.toFixed(2).replace('.', ',')}`,
            priceValue: productData.price
        };
        
        modal.querySelector('#modalItemName').textContent = currentItem.name;
        modal.querySelector('#modalItemDescription').textContent = currentItem.description || '';
        modal.querySelector('#modalItemPrice').textContent = currentItem.price;
        modal.querySelector('#itemQuantity').value = 1;
        modal.querySelector('#itemObservations').value = '';
        
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    // A partir daqui, é o seu código original do repositório, garantindo que nada se perca.
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

    function setupOriginalEventListeners() {
        document.querySelectorAll('.menu-section').forEach((section, index) => {
            section.classList.add('fade-in-hidden');
            section.style.animationDelay = `${index * 0.1}s`;
            observer.observe(section);
        });

        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('mouseenter', function() { this.style.transform = 'translateX(8px) scale(1.02)'; });
            item.addEventListener('mouseleave', function() { this.style.transform = 'translateX(0) scale(1)'; });
        });
    }

    function initializeModalAndCart() {
        const modal = document.getElementById('itemModal');
        const closeBtn = document.querySelector('.close');
        
        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        window.addEventListener('click', (event) => {
            if (event.target === modal) closeModal();
        });
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') closeModal();
        });
        updateCartDisplay();
    }

    window.closeModal = function() {
        const modal = document.getElementById('itemModal');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        currentItem = null;
    }

    window.changeQuantity = function(delta) {
        const quantityInput = document.getElementById('itemQuantity');
        let newQuantity = parseInt(quantityInput.value) + delta;
        if (newQuantity < 1) newQuantity = 1;
        if (newQuantity > 99) newQuantity = 99;
        quantityInput.value = newQuantity;
    }

    window.addToCart = function() {
        if (!currentItem) return;
        const quantity = parseInt(document.getElementById('itemQuantity').value);
        const observations = document.getElementById('itemObservations').value.trim();
        const existingItemIndex = cart.findIndex(item => item.id === currentItem.id && item.observations === observations);
        
        if (existingItemIndex !== -1) {
            cart[existingItemIndex].quantity += quantity;
        } else {
            cart.push({ ...currentItem, quantity: quantity, observations: observations });
        }
        updateCartDisplay();
        closeModal();
        showNotification('Item adicionado ao carrinho! 🛒');
    }

    window.removeFromCart = function(index) {
        cart.splice(index, 1);
        updateCartDisplay();
        showNotification('Item removido do carrinho!');
    }

    window.updateCartQuantity = function(index, delta) {
        if(!cart[index]) return;
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

    window.toggleCart = function() {
        const cartEl = document.getElementById('cart');
        cartEl.classList.toggle('open');
    }

    window.sendToWhatsApp = function() {
        if (cart.length === 0) {
            showNotification('Carrinho vazio! Adicione itens primeiro.');
            return;
        }
        let message = '🍽️ *PEDIDO INTEGRA PETISCARIA* 🍽️\n\n*Itens do pedido:*\n\n';
        cart.forEach((item, index) => {
            message += `${index + 1}. *${item.name}*\n   ${item.price} x ${item.quantity} un.\n`;
            if (item.observations) {
                message += `   _Obs: ${item.observations}_\n`;
            }
            message += '\n';
        });
        
        const totalValue = cart.reduce((sum, item) => sum + (item.priceValue * item.quantity), 0);
        message += `*Total: R$ ${totalValue.toFixed(2).replace('.', ',')}*\n\nObrigado! 🍽️`;
        
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
            position: fixed; top: 20px; right: 20px; background: var(--primary); color: var(--primary-foreground);
            padding: 1rem 1.5rem; border-radius: var(--radius); box-shadow: var(--shadow-card); z-index: 10000;
            animation: slideInRight 0.3s ease-out; font-weight: 500;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out forwards';
            setTimeout(() => { notification.remove(); }, 300);
        }, 3000);
    }

    const notificationStyle = document.createElement('style');
    notificationStyle.textContent = `
        @keyframes slideInRight { from { opacity: 0; transform: translateX(100%); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideOutRight { to { opacity: 0; transform: translateX(100%); } }
    `;
    document.head.appendChild(notificationStyle);

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

    // --- INICIA A APLICAÇÃO ---
    initializeApp();
});