document.addEventListener('DOMContentLoaded', function() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    const sections = document.querySelectorAll('.menu-section');
    sections.forEach(section => {
        section.classList.add('fade-in-hidden');
        observer.observe(section);
    });

    const whatsappBtn = document.querySelector('.whatsapp-button');
    if (whatsappBtn) {
        whatsappBtn.style.transform = 'scale(0)';
        setTimeout(() => {
            whatsappBtn.style.transition = 'transform 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55)';
            whatsappBtn.style.transform = 'scale(1)';
        }, 500);
    }
});