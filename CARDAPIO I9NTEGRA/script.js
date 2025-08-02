document.addEventListener('DOMContentLoaded', function() {
    
    // --- 1. CONFIGURAÇÃO DO SUPABASE ---
    const SUPABASE_URL = 'https://llpyzevrzgfqwxvbguli.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxscHl6ZXZyemdmcXd4dmJndWxpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5MDk5MTIsImV4cCI6MjA2OTQ4NTkxMn0.RYHbYNr-7Ksb-WmuOTOrQETB1tx_IUP1FC_JBuzdn60';

    const { createClient } = supabase;
    const _supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // --- 2. ESTADO DA APLICAÇÃO ---
    let allProducts = [];
    let allCategories = [];
    
    // --- 3. FUNÇÃO PRINCIPAL ---
    async function initializeApp() {
        await fetchData();
        renderCategories();
        renderMenu();
        setupEventListeners();
        initializeModal();
        setupBackToTopButton();
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
        const desktopContainer = document.getElementById('filterContainerDesktop');
        const mobileSelect = document.getElementById('categorySelect');
        
        if (!desktopContainer || !mobileSelect) return;

        desktopContainer.innerHTML = ''; 
        mobileSelect.innerHTML = '';

        const allButton = document.createElement('button');
        allButton.className = 'filter-btn active';
        allButton.textContent = 'Todos';
        allButton.dataset.categoryId = 'all';
        desktopContainer.appendChild(allButton);

        const allOption = document.createElement('option');
        allOption.value = 'all';
        allOption.textContent = 'Todas as Categorias';
        mobileSelect.appendChild(allOption);

        allCategories.forEach(category => {
            const button = document.createElement('button');
            button.className = 'filter-btn';
            button.textContent = category.name;
            button.dataset.categoryId = category.id;
            desktopContainer.appendChild(button);

            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            mobileSelect.appendChild(option);
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
        
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', () => {
                const productId = item.dataset.productId;
                const productData = allProducts.find(p => p.id == productId);
                if (productData) openItemModal(productData);
            });
        });
    }

    // --- 5. OUVINTES DE EVENTOS (ATUALIZADO PARA AMBOS OS FILTROS) ---
    function setupEventListeners() {
        const searchInput = document.getElementById('searchInput');
        const desktopContainer = document.getElementById('filterContainerDesktop');
        const mobileSelect = document.getElementById('categorySelect');

        if(searchInput) {
            searchInput.addEventListener('input', (e) => {
                const searchTerm = e.target.value;
                const categoryId = mobileSelect.value; // Pega o valor do select como fonte da verdade
                renderMenu(searchTerm, categoryId);
            });
        }
        
        if(desktopContainer) {
            desktopContainer.addEventListener('click', (e) => {
                if (e.target.classList.contains('filter-btn')) {
                    const categoryId = e.target.dataset.categoryId;
                    mobileSelect.value = categoryId; // Sincroniza o select
                    const currentActive = desktopContainer.querySelector('.active');
                    if (currentActive) currentActive.classList.remove('active');
                    e.target.classList.add('active');
                    renderMenu(searchInput.value, categoryId);
                }
            });
        }
        
        if(mobileSelect) {
            mobileSelect.addEventListener('change', (e) => {
                const categoryId = e.target.value;
                const desktopButton = desktopContainer.querySelector(`[data-category-id="${categoryId}"]`);
                const currentActive = desktopContainer.querySelector('.active');
                if (currentActive) currentActive.classList.remove('active');
                if (desktopButton) desktopButton.classList.add('active');
                renderMenu(searchInput.value, categoryId);
            });
        }
    }

    // --- 6. CÓDIGO DO MODAL DE VISUALIZAÇÃO ---
    
    function initializeModal() {
        const modal = document.getElementById('itemModal');
        if(modal) {
            const closeBtn = modal.querySelector('.close');
            if(closeBtn) closeBtn.addEventListener('click', closeModal);
            document.addEventListener('keydown', (event) => {
                if (event.key === 'Escape' && modal.style.display === 'block') closeModal();
            });
        }
    }

    function openItemModal(productData) {
        const modal = document.getElementById('itemModal');
        
        modal.querySelector('#modalItemName').textContent = productData.name;
        modal.querySelector('#modalItemDescription').textContent = productData.description || '';
        modal.querySelector('#modalItemPrice').textContent = productData.price_details || `R$ ${productData.price.toFixed(2).replace('.', ',')}`;
        
        const modalImage = modal.querySelector('#modalItemImage');
        const placeholder = modal.querySelector('.image-placeholder');
        
        if (productData.image_url) {
            modalImage.src = productData.image_url;
            modalImage.style.display = 'block';
            if(placeholder) placeholder.style.display = 'none';
        } else {
            modalImage.style.display = 'none';
            if(placeholder) placeholder.style.display = 'block';
        }
        
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    window.closeModal = function() {
        const modal = document.getElementById('itemModal');
        modal.classList.remove('open');
        document.body.style.overflow = 'auto';
    }

    function setupBackToTopButton() {
        // Implementação do botão de voltar ao topo, se desejar
    }

    // --- INICIA A APLICAÇÃO ---
    initializeApp();
});