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
        renderMenu(); // Renderiza o menu inicial com "Todos"
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
        if (!desktopContainer) return;

        desktopContainer.innerHTML = ''; 

        const allButton = document.createElement('button');
        allButton.className = 'filter-btn active';
        allButton.textContent = 'Todos';
        allButton.dataset.categoryId = 'all';
        desktopContainer.appendChild(allButton);

        allCategories.forEach(category => {
            if (category.parent_id === null) {
                const button = document.createElement('button');
                button.className = 'filter-btn';
                button.textContent = category.name;
                button.dataset.categoryId = category.id;
    
                if (category.name.toLowerCase() === 'happy hour') {
                    button.classList.add('happy-hour-special');
                }
    
                desktopContainer.appendChild(button);
            }
        });
    }
    
    function renderMenu(searchTerm = '', categoryId = 'all') {
        const container = document.getElementById('menuContent');
        if (!container) return;
        container.innerHTML = '';

        const filteredProducts = allProducts.filter(product => {
            const productCategory = allCategories.find(c => c.id === product.category_id);
            if (!productCategory) return false;

            const matchesSearch = !searchTerm || product.name.toLowerCase().includes(searchTerm.toLowerCase());
            
            if (categoryId === 'all') {
                return matchesSearch;
            }

            const matchesCategory = product.category_id == categoryId || productCategory.parent_id == categoryId;
            return matchesCategory && matchesSearch;
        });

        let categoriesToRender;

        if (categoryId === 'all') {
            // Pega todas as categorias pai para renderizar
            let parentCategories = allCategories.filter(c => c.parent_id === null);
            
            // Lógica de reordenação: Só roda quando "Todos" está selecionado
            const happyHourCategory = parentCategories.find(c => c.name.toLowerCase() === 'happy hour');
            if (happyHourCategory) {
                parentCategories = parentCategories.filter(c => c.id !== happyHourCategory.id);
                parentCategories.push(happyHourCategory);
            }
            categoriesToRender = parentCategories;

        } else {
            // Se um filtro específico for clicado, renderiza apenas essa categoria
            categoriesToRender = allCategories.filter(c => c.id == categoryId);
        }

        categoriesToRender.forEach(category => {
            const subCategories = allCategories.filter(sc => sc.parent_id === category.id);
            
            const productsInCategory = filteredProducts.filter(p => {
                const pCat = allCategories.find(c => c.id === p.category_id);
                return p.category_id === category.id || (pCat && pCat.parent_id === category.id);
            });

            if (productsInCategory.length > 0) {
                const section = document.createElement('div');
                section.className = 'menu-section';

                if (category.name.toLowerCase() === 'happy hour') {
                    section.classList.add('happy-hour-section-special');
                    section.innerHTML = `
                        <div class="happy-hour-info">
                            <h3>Horários do Happy Hour</h3>
                            <p><strong>Quartas e Quintas:</strong> 17h às 21h</p>
                            <p><strong>Sextas:</strong> 17h às 19h | <strong>Sábados:</strong> 15h às 19h</p>
                            <p class="disclaimer">*Exceto vésperas de feriados e feriados. Não aceitamos vale alimentação no Happy Hour.</p>
                        </div>
                    `;
                }
                
                section.innerHTML += `<h2>${category.name}</h2>`;

                if (subCategories.length > 0) {
                    subCategories.forEach(sc => {
                        const productsInSubCategory = filteredProducts.filter(p => p.category_id === sc.id);
                        if (productsInSubCategory.length > 0) {
                            section.innerHTML += `<h3 class="submenu-section-title">${sc.name}</h3>`;
                            productsInSubCategory.forEach(product => {
                                section.innerHTML += generateProductHTML(product);
                            });
                        }
                    });
                } else {
                    productsInCategory.forEach(product => {
                        section.innerHTML += generateProductHTML(product);
                    });
                }
                container.appendChild(section);
            }
        });
        
        addEventListenersToMenuItems();
    }

    function generateProductHTML(product) {
        const priceText = product.price_details || `R$ ${product.price.toFixed(2).replace('.', ',')}`;
        const descriptionHTML = product.description ? `<div class="item-description">${product.description}</div>` : '';
        return `
            <div class="menu-item" data-product-id="${product.id}">
                <div class="item-details">
                    <span class="item-name">${product.name}</span>
                    ${descriptionHTML}
                </div>
                <div class="price-and-action">
                    <span class="price">${priceText}</span>
                    <span class="action-indicator">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                    </span>
                </div>
            </div>
        `;
    }
    
    function addEventListenersToMenuItems() {
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', () => {
                const productId = item.dataset.productId;
                const productData = allProducts.find(p => p.id == productId);
                if (productData) openItemModal(productData);
            });
        });
    }

    function setupEventListeners() {
        const searchInput = document.getElementById('searchInput');
        const desktopContainer = document.getElementById('filterContainerDesktop');

        let currentCategoryId = 'all';

        if(searchInput) {
            searchInput.addEventListener('input', (e) => {
                const searchTerm = e.target.value;
                renderMenu(searchTerm, currentCategoryId);
            });
        }

        if(desktopContainer) {
            desktopContainer.addEventListener('click', (e) => {
                if (e.target.classList.contains('filter-btn')) {
                    currentCategoryId = e.target.dataset.categoryId; 
                    
                    const currentActive = desktopContainer.querySelector('.active');
                    if (currentActive) currentActive.classList.remove('active');
                    e.target.classList.add('active');
                    
                    renderMenu(searchInput.value, currentCategoryId);
                }
            });
        }
    }

    function initializeModal() {
        const modal = document.getElementById('itemModal');
        if(modal) {
            const closeBtn = modal.querySelector('.close');
            if(closeBtn) closeBtn.addEventListener('click', closeModal);
            modal.addEventListener('click', function(event) {
                if (event.target === modal) {
                    closeModal();
                }
            });
            document.addEventListener('keydown', (event) => {
                if (event.key === 'Escape' && modal.classList.contains('open')) closeModal();
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

    initializeApp();
});