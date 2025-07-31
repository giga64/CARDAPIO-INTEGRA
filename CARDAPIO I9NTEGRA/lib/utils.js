// Função utilitária para combinar classes CSS
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

// Função para formatar preços
export function formatPrice(price) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);
}

// Função para debounce
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Função para validar email
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Função para capitalizar primeira letra
export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
} 