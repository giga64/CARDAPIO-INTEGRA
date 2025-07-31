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

    // Efeito de digitação para títulos (opcional)
    const typeWriter = (element, text, speed = 100) => {
        let i = 0;
        element.innerHTML = '';
        const timer = setInterval(() => {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
            } else {
                clearInterval(timer);
            }
        }, speed);
    };

    // Adicionar funcionalidade de busca (se necessário no futuro)
    const searchFunctionality = () => {
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Buscar no cardápio...';
        searchInput.className = 'search-input';
        searchInput.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 10px 15px;
            border: 2px solid var(--primary);
            border-radius: var(--radius);
            background: var(--card);
            color: var(--foreground);
            z-index: 100;
            width: 200px;
            font-size: 14px;
        `;

        // Adicionar ao DOM se necessário
        // document.body.appendChild(searchInput);
    };

    // Inicializar funcionalidades
    searchFunctionality();

    // Adicionar efeito de confete no carregamento (opcional)
    const addConfetti = () => {
        const colors = ['#fb2404', '#25D366', '#1a1a1a', '#f4f4f9'];
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                top: -10px;
                left: ${Math.random() * 100}vw;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                animation: confetti-fall 3s linear forwards;
            `;
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                confetti.remove();
            }, 3000);
        }
    };

    // Adicionar CSS para animação de confete
    const confettiStyle = document.createElement('style');
    confettiStyle.textContent = `
        @keyframes confetti-fall {
            to {
                transform: translateY(100vh) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(confettiStyle);

    // Executar confete apenas uma vez no carregamento
    setTimeout(addConfetti, 500);

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

    console.log('🎉 Integra Cardápio carregado com sucesso!');
});